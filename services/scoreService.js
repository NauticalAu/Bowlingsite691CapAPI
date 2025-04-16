const db = require('../config/db');

const calculateScores = async (gameId) => {
  // Step 1: Load all frames for this game, ordered by frame number
  const { rows: frames } = await db.query(
    `SELECT * FROM frame WHERE game_id = $1 ORDER BY frame_number`,
    [gameId]
  );

  let cumulativeScore = 0;

  for (let i = 0; i < frames.length; i++) {
    const current = frames[i];
    const next = frames[i + 1];
    const next2 = frames[i + 2];

    let frameScore = 0;

    const { frame_number, first_roll, second_roll, bonus_roll } = current;

    if (frame_number === 10) {
      // Tenth frame logic
      frameScore = (first_roll || 0) + (second_roll || 0) + (bonus_roll || 0);
    } else if (first_roll === 10) {
      // Strike
      frameScore = 10 + 
        (next?.first_roll || 0) + 
        (next?.first_roll === 10 ? (next2?.first_roll || 0) : (next?.second_roll || 0));
    } else if ((first_roll || 0) + (second_roll || 0) === 10) {
      // Spare
      frameScore = 10 + (next?.first_roll || 0);
    } else {
      // Open frame
      frameScore = (first_roll || 0) + (second_roll || 0);
    }

    cumulativeScore += frameScore;

    // Update the frame_score column
    await db.query(
      `UPDATE frame SET frame_score = $1 WHERE frame_id = $2`,
      [frameScore, current.frame_id]
    );
  }

  // Update the total_score on the game
  await db.query(
    `UPDATE game SET total_score = $1 WHERE game_id = $2`,
    [cumulativeScore, gameId]
  );

  return cumulativeScore;
};

module.exports = { calculateScores };
