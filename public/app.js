const { useState } = React;

function numberOrEmpty(value) {
  return value === '' || value === null || value === undefined ? '' : String(value);
}

function App() {
  const [form, setForm] = useState({
    ma101: {},
    ph101: {},
    ph102: {},
    ge102: {},
    ge104: {},
    humanities: { type: 'HS102' },
    nso: {},
    hs101: {},
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(section, key, value) {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }

  async function handleCalculate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cgpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Unable to calculate CGPA');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({
      ma101: {},
      ph101: {},
      ph102: {},
      ge102: {},
      ge104: {},
      humanities: { type: 'HS102' },
      nso: {},
      hs101: {},
    });
    setResult(null);
    setError('');
  }

  const cgpaValue = result ? result.cgpa.toFixed(3) : '--';
  const totalCredits = result ? result.totalCredits.toFixed(1) : '--';
  const totalGP = result ? result.totalGradePoints.toFixed(2) : '--';

  const courses = result ? result.courses : {};

  const humanitiesType = form.humanities.type === 'HS103' ? 'HS103' : 'HS102';

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-logo">IR</div>
          <div className="brand-text">
            <h1>IIT Ropar CGPA Calculator</h1>
            <p>Monsoon Semester · Interactive grade & CGPA estimator</p>
          </div>
        </div>
        <div className="pill">MERN-style · Express + React SPA</div>
      </header>

      <div className="layout">
        {/* Left: inputs */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Enter your marks</div>
              <div className="card-subtitle">
                Courses as per typical IIT Ropar first-year structure
              </div>
            </div>
            <div className="badge">Real-time CGPA via API</div>
          </div>

          <form onSubmit={handleCalculate}>
            <div className="form-grid">
              {/* MA101 */}
              <section className="section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">MA101 · Mathematics</div>
                    <div className="section-meta">3 credits · Internal + End sem</div>
                  </div>
                </div>
                <div className="fields-grid">
                  <div className="field">
                    <label>Quiz 1</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ma101.q1)}
                      onChange={e => updateField('ma101', 'q1', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Mid-sem</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ma101.mid)}
                      onChange={e => updateField('ma101', 'mid', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Quiz 2</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ma101.q2)}
                      onChange={e => updateField('ma101', 'q2', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>End-sem</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ma101.end)}
                      onChange={e => updateField('ma101', 'end', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Tutorial</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ma101.tutorial)}
                      onChange={e => updateField('ma101', 'tutorial', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Bonus</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ma101.bonus)}
                      onChange={e => updateField('ma101', 'bonus', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* PH101 */}
              <section className="section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">PH101 · Physics for Engineering</div>
                    <div className="section-meta">3 credits · Theory</div>
                  </div>
                </div>
                <div className="fields-grid">
                  <div className="field">
                    <label>Quiz 1</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ph101.q1)}
                      onChange={e => updateField('ph101', 'q1', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Mid-sem</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ph101.mid)}
                      onChange={e => updateField('ph101', 'mid', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Quiz 2</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ph101.q2)}
                      onChange={e => updateField('ph101', 'q2', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>End-sem</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ph101.end)}
                      onChange={e => updateField('ph101', 'end', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Attendance</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ph101.attendance)}
                      onChange={e => updateField('ph101', 'attendance', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* PH102 & GE102 */}
              <section className="section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">PH102 · Lab</div>
                    <div className="section-meta">2 credits · Enter grade point</div>
                  </div>
                </div>
                <div className="fields-grid">
                  <div className="field">
                    <label>Grade point</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ph102.grade)}
                      onChange={e => updateField('ph102', 'grade', e.target.value)}
                    />
                  </div>
                </div>

                <div className="section-header" style={{ marginTop: 10 }}>
                  <div>
                    <div className="section-title">GE102 · Mechanical Workshop</div>
                    <div className="section-meta">2 credits · Enter grade point</div>
                  </div>
                </div>
                <div className="fields-grid">
                  <div className="field">
                    <label>Grade point</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ge102.grade)}
                      onChange={e => updateField('ge102', 'grade', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* GE104 */}
              <section className="section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">GE104 · Electrical Engineering</div>
                    <div className="section-meta">3 credits · Weighted components</div>
                  </div>
                </div>
                <div className="fields-grid">
                  <div className="field">
                    <label>Quiz 1</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ge104.q1)}
                      onChange={e => updateField('ge104', 'q1', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Mid-sem (out of 45)</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ge104.mid)}
                      onChange={e => updateField('ge104', 'mid', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Quiz 2</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ge104.q2)}
                      onChange={e => updateField('ge104', 'q2', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>End-sem (out of 90)</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ge104.end)}
                      onChange={e => updateField('ge104', 'end', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Lab marks</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.ge104.lab)}
                      onChange={e => updateField('ge104', 'lab', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Humanities */}
              <section className="section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">English · HS102 / HS103</div>
                    <div className="section-meta">3 credits · Select your course</div>
                  </div>
                  <div className="field" style={{ maxWidth: 140 }}>
                    <label>Course</label>
                    <select
                      value={humanitiesType}
                      onChange={e =>
                        setForm(prev => ({
                          ...prev,
                          humanities: {
                            ...prev.humanities,
                            type: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="HS102">HS102</option>
                      <option value="HS103">HS103</option>
                    </select>
                  </div>
                </div>

                {humanitiesType === 'HS102' ? (
                  <div className="fields-grid">
                    <div className="field">
                      <label>Quiz 1</label>
                      <input
                        type="number"
                        value={numberOrEmpty(form.humanities.q1)}
                        onChange={e => updateField('humanities', 'q1', e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Mid-sem</label>
                      <input
                        type="number"
                        value={numberOrEmpty(form.humanities.mid)}
                        onChange={e => updateField('humanities', 'mid', e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Quiz 2</label>
                      <input
                        type="number"
                        value={numberOrEmpty(form.humanities.q2)}
                        onChange={e => updateField('humanities', 'q2', e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>End-sem</label>
                      <input
                        type="number"
                        value={numberOrEmpty(form.humanities.end)}
                        onChange={e => updateField('humanities', 'end', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="fields-grid">
                    <div className="field">
                      <label>Mid-sem</label>
                      <input
                        type="number"
                        value={numberOrEmpty(form.humanities.mid)}
                        onChange={e => updateField('humanities', 'mid', e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>End-sem</label>
                      <input
                        type="number"
                        value={numberOrEmpty(form.humanities.end)}
                        onChange={e => updateField('humanities', 'end', e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>TA number</label>
                      <input
                        type="number"
                        value={numberOrEmpty(form.humanities.ta)}
                        onChange={e => updateField('humanities', 'ta', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* NSO & HS101 */}
              <section className="section-card">
                <div className="section-header">
                  <div>
                    <div className="section-title">NSO/NSS · Activity</div>
                    <div className="section-meta">1 credit · Grade point</div>
                  </div>
                </div>
                <div className="fields-grid">
                  <div className="field">
                    <label>NSO grade point</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.nso.grade)}
                      onChange={e => updateField('nso', 'grade', e.target.value)}
                    />
                  </div>
                </div>

                <div className="section-header" style={{ marginTop: 10 }}>
                  <div>
                    <div className="section-title">HS101 · History of Technology</div>
                    <div className="section-meta">1.5 credits · Mid-Sem + End + Attendance</div>
                  </div>
                </div>
                <div className="fields-grid">
                  <div className="field">
                    <label>Mid-Sem</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.hs101.mini)}
                      onChange={e => updateField('hs101', 'mini', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>End-sem</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.hs101.end)}
                      onChange={e => updateField('hs101', 'end', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Attendance</label>
                    <input
                      type="number"
                      value={numberOrEmpty(form.hs101.attendance)}
                      onChange={e => updateField('hs101', 'attendance', e.target.value)}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="actions">
              <button type="button" className="button-secondary" onClick={handleReset}>
                Clear all
              </button>
              <button type="submit" className="button-primary" disabled={loading}>
                {loading ? 'Calculating…' : 'Calculate CGPA'}
              </button>
            </div>

            {error && (
              <div className="error-banner">{error}</div>
            )}
          </form>
        </div>

        {/* Right: summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Summary & grade breakdown</div>
              <div className="card-subtitle">Per-course grade points and overall CGPA</div>
            </div>
          </div>

          <div className="summary-main">
            <div className="summary-top">
              <div className="glass-panel">
                <div className="cgpa-label">Computed CGPA</div>
                <div className="cgpa-value">{cgpaValue}</div>
                <div className="cgpa-meta">
                  <span className="kpi-label">Total credits:</span>{' '}
                  <span className="kpi-value">{totalCredits}</span>
                  <br />
                  <span className="kpi-label">Total grade points:</span>{' '}
                  <span className="kpi-value">{totalGP}</span>
                </div>
                <div className="chip-row">
                  <div className="chip">MA101 · PH101 · GE104 · HS101</div>
                  <div className="chip">Labs, NSO & English included</div>
                </div>
              </div>

              <div className="glass-panel">
                <div className="kpi-label">Quick status</div>
                <div className="status-row">
                  <div>
                    <span className="status-dot ok" />
                    Inputs can be partially filled – missing fields count as 0.
                  </div>
                </div>
                <div className="status-row">
                  <div>
                    <span className="status-dot warn" />
                    Use the same marking scheme as your course instructors.
                  </div>
                </div>
                <div className="status-row">
                  <div>
                    <span className="status-dot err" />
                    This is an unofficial estimator – not an official transcript.
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel">
              <div className="kpi-label" style={{ marginBottom: 6 }}>
                Course-wise grade points
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Credits</th>
                      <th>Total marks</th>
                      <th>Grade point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(courses).length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280' }}>
                          Fill in marks and click "Calculate" to see breakdown.
                        </td>
                      </tr>
                    )}

                    {Object.entries(courses).map(([code, info]) => {
                      const total = info.total !== undefined ? info.total.toFixed(2) : '—';
                      const grade = info.grade !== undefined ? info.grade : '—';
                      const credits = info.credits ?? '—';
                      const isZero = grade === 0;

                      return (
                        <tr key={code}>
                          <td>{code}</td>
                          <td>{credits}</td>
                          <td>{total}</td>
                          <td>
                            <span className={isZero ? 'grade-pill zero' : 'grade-pill'}>
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
