function gradeFromThresholds(score, thresholds) {
  for (const [minScore, gradePoint] of thresholds) {
    if (score >= minScore) return gradePoint;
  }
  // Below minimum passing – treat as F (0 grade point)
  return 0;
}

function parseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function clampGradePoint(gp) {
  // Ensure direct grade inputs like PH102/GE102/NSO stay in [0, 10]
  if (!Number.isFinite(gp)) return 0;
  if (gp < 0) return 0;
  if (gp > 10) return 10;
  return gp;
}

function ensureMax(value, max, label) {
  if (value > max) {
    throw new Error(label + ' cannot exceed ' + max);
  }
}

function calculateCgpa(input) {
  let totalGradePoints = 0;
  let totalCredits = 0;

  // MA101 (3 credits)
  const ma = input.ma101 || {};
  const ma_q1 = parseNumber(ma.q1);
  const ma_mid = parseNumber(ma.mid);
  const ma_q2 = parseNumber(ma.q2);
  const ma_end = parseNumber(ma.end);
  const ma_tutorial = parseNumber(ma.tutorial);
  const ma_bonus = parseNumber(ma.bonus);
  ensureMax(ma_q1, 10, 'MA101 Quiz 1');
  ensureMax(ma_mid, 30, 'MA101 Mid-sem');
  ensureMax(ma_q2, 10, 'MA101 Quiz 2');
  ensureMax(ma_end, 40, 'MA101 End-sem');
  ensureMax(ma_tutorial, 10, 'MA101 Tutorial');
  ensureMax(ma_bonus, 4, 'MA101 Bonus');
  const ma_total = ma_q1 + ma_mid + ma_q2 + ma_end + ma_tutorial + ma_bonus;

  // Extended MA101 thresholds (down to 4 grade point)
  const ma_thresholds = [
    [75.0, 10],
    [70.0, 9],
    [65.0, 8],
    [59.0, 7],
    [54.0, 6],
    [49.0, 5],
    [44.0, 4],
  ];
  const ma_grade = gradeFromThresholds(ma_total, ma_thresholds);
  totalGradePoints += ma_grade * 3.0;
  totalCredits += 3.0;

  // PH101 (3 credits)
  const ph1 = input.ph101 || {};
  const ph_q1 = parseNumber(ph1.q1);
  const ph_mid = parseNumber(ph1.mid);
  const ph_q2 = parseNumber(ph1.q2);
  const ph_end = parseNumber(ph1.end);
  const ph_att = parseNumber(ph1.attendance);
  ensureMax(ph_q1, 10, 'PH101 Quiz 1');
  ensureMax(ph_mid, 30, 'PH101 Mid-sem');
  ensureMax(ph_q2, 10, 'PH101 Quiz 2');
  ensureMax(ph_end, 40, 'PH101 End-sem');
  ensureMax(ph_att, 10, 'PH101 Attendance');
  const ph_total = ph_q1 + ph_mid + ph_q2 + ph_end + ph_att;

  // Extended PH101 thresholds
  const ph_thresholds = [
    [85.0, 10],
    [75.0, 9],
    [65.0, 8],
    [60.0, 7],
    [55.0, 6],
    [50.0, 5],
    [45.0, 4],
  ];
  const ph_grade = gradeFromThresholds(ph_total, ph_thresholds);
  totalGradePoints += ph_grade * 3.0;
  totalCredits += 3.0;

  // PH102 (2 credits) - direct grade input
  const ph102 = input.ph102 || {};
  const ph102_grade_raw = parseNumber(ph102.grade);
  ensureMax(ph102_grade_raw, 10, 'PH102 grade');
  const ph102_grade = clampGradePoint(ph102_grade_raw);
  totalGradePoints += ph102_grade * 2.0;
  totalCredits += 2.0;

  // GE102 (2 credits) - direct grade input
  const ge102 = input.ge102 || {};
  const ge102_grade_raw = parseNumber(ge102.grade);
  ensureMax(ge102_grade_raw, 10, 'GE102 grade');
  const ge102_grade = clampGradePoint(ge102_grade_raw);
  totalGradePoints += ge102_grade * 2.0;
  totalCredits += 2.0;

  // GE104 (3 credits)
  const ge = input.ge104 || {};
  const ge_q1 = parseNumber(ge.q1);
  const ge_mid = parseNumber(ge.mid); // out of 45
  const ge_q2 = parseNumber(ge.q2);
  const ge_end = parseNumber(ge.end); // out of 90
  const ge_lab = parseNumber(ge.lab);

  // Your weighted formula (kept exactly as you wrote)
  ensureMax(ge_q1, 30, 'GE104 Quiz 1');
  ensureMax(ge_mid, 45, 'GE104 Mid-sem');
  ensureMax(ge_q2, 100, 'GE104 Quiz 2');
  ensureMax(ge_end, 90, 'GE104 End-sem');
  ensureMax(ge_lab, 50, 'GE104 Lab marks');

  const ge_total =
    ge_q1 / 2.0 +
    (ge_mid / 45.0) * 25.0 +
    ge_q2 * 0.15 +
    (ge_end / 90.0) * 40.0 +
    ge_lab;

  // Extended GE104 thresholds
  const ge104_thresholds = [
    [120.0, 10],
    [115.0, 9],
    [100.0, 8],
    [80.0, 7],
    [70.0, 6],
    [60.0, 5],
    [50.0, 4],
  ];
  const ge104_grade = gradeFromThresholds(ge_total, ge104_thresholds);
  totalGradePoints += ge104_grade * 3.0;
  totalCredits += 3.0;

  // Humanities: HS102 or HS103 (3 credits)
  const hum = input.humanities || {};
  const humType = hum.type === 'HS103' ? 'HS103' : 'HS102';
  let hum_total = 0;
  let hum_grade = 0;

  if (humType === 'HS102') {
    const hs_q1 = parseNumber(hum.q1);
    const hs_mid = parseNumber(hum.mid);
    const hs_q2 = parseNumber(hum.q2);
    const hs_end = parseNumber(hum.end);
    ensureMax(hs_q1, 15, 'HS102 Quiz 1');
    ensureMax(hs_mid, 30, 'HS102 Mid-sem');
    ensureMax(hs_q2, 15, 'HS102 Quiz 2');
    ensureMax(hs_end, 40, 'HS102 End-sem');
    hum_total = hs_q1 + hs_mid + hs_q2 + hs_end;

    // Extended HS102 thresholds
    const hs102_thresholds = [
      [80.0, 10],
      [75.0, 9],
      [70.0, 8],
      [60.0, 7],
      [55.0, 6],
      [50.0, 5],
      [45.0, 4],
    ];
    hum_grade = gradeFromThresholds(hum_total, hs102_thresholds);
  } else {
    const hs_mid = parseNumber(hum.mid);
    const hs_end = parseNumber(hum.end);
    const hs_ta = parseNumber(hum.ta);
    ensureMax(hs_mid, 30, 'HS103 Mid-sem');
    ensureMax(hs_end, 40, 'HS103 End-sem');
    ensureMax(hs_ta, 30, 'HS103 TA');
    hum_total = hs_ta + hs_mid + hs_end;

    // Extended HS103 thresholds
    const hs103_thresholds = [
      [82.0, 10],
      [70.0, 9],
      [65.0, 8],
      [60.0, 7],
      [55.0, 6],
      [50.0, 5],
      [45.0, 4],
    ];
    hum_grade = gradeFromThresholds(hum_total, hs103_thresholds);
  }
  totalGradePoints += hum_grade * 3.0;
  totalCredits += 3.0;

  // NSO (1 credit)
  const nso = input.nso || {};
  const nso_grade_raw = parseNumber(nso.grade);
  ensureMax(nso_grade_raw, 10, 'NSO grade');
  const nso_grade = clampGradePoint(nso_grade_raw);
  totalGradePoints += nso_grade * 1.0;
  totalCredits += 1.0;

  // HS101 (1.5 credits)
  const hs101 = input.hs101 || {};
  const hs101_min = parseNumber(hs101.mini);
  const hs101_end = parseNumber(hs101.end);
  const hs101_att = parseNumber(hs101.attendance);
  ensureMax(hs101_min, 40, 'HS101 Mid-sem');
  ensureMax(hs101_end, 55, 'HS101 End-sem');
  ensureMax(hs101_att, 5, 'HS101 Attendance');
  const hs101_total = hs101_min + hs101_end + hs101_att;

  // Extended HS101 thresholds
  const hs101_thresholds = [
    [80.0, 10],
    [70.0, 9],
    [60.0, 8],
    [55.0, 7],
    [50.0, 6],
    [45.0, 5],
    [40.0, 4],
  ];
  const hs101_grade = gradeFromThresholds(hs101_total, hs101_thresholds);
  totalGradePoints += hs101_grade * 1.5;
  totalCredits += 1.5;

  const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  return {
    courses: {
      MA101: { total: ma_total, grade: ma_grade, credits: 3 },
      PH101: { total: ph_total, grade: ph_grade, credits: 3 },
      PH102: { grade: ph102_grade, credits: 2 },
      GE102: { grade: ge102_grade, credits: 2 },
      GE104: { total: ge_total, grade: ge104_grade, credits: 3 },
      [humType]: { total: hum_total, grade: hum_grade, credits: 3 },
      NSO: { grade: nso_grade, credits: 1 },
      HS101: { total: hs101_total, grade: hs101_grade, credits: 1.5 },
    },
    totalCredits,
    totalGradePoints,
    cgpa,
  };
}

module.exports = { calculateCgpa };
