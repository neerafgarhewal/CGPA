let currentUserId = null;
let currentUserName = null;
let currentUserBranch = null;
let gradesChart = null;

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function buildPayload(form) {
  const humType = form.hum_type.value === 'HS103' ? 'HS103' : 'HS102';

  return {
    ma101: {
      q1: toNumber(form.ma_q1.value),
      mid: toNumber(form.ma_mid.value),
      q2: toNumber(form.ma_q2.value),
      end: toNumber(form.ma_end.value),
      tutorial: toNumber(form.ma_tutorial.value),
      bonus: toNumber(form.ma_bonus.value),
    },
    ph101: {
      q1: toNumber(form.ph_q1.value),
      mid: toNumber(form.ph_mid.value),
      q2: toNumber(form.ph_q2.value),
      end: toNumber(form.ph_end.value),
      attendance: toNumber(form.ph_att.value),
    },
    ph102: {
      grade: toNumber(form.ph102_grade.value),
    },
    ge102: {
      grade: toNumber(form.ge102_grade.value),
    },
    ge104: {
      q1: toNumber(form.ge_q1.value),
      mid: toNumber(form.ge_mid.value),
      q2: toNumber(form.ge_q2.value),
      end: toNumber(form.ge_end.value),
      lab: toNumber(form.ge_lab.value),
    },
    humanities: humType === 'HS102'
      ? {
          type: 'HS102',
          q1: toNumber(form.hs_q1.value),
          mid: toNumber(form.hs_mid.value),
          q2: toNumber(form.hs_q2.value),
          end: toNumber(form.hs_end.value),
        }
      : {
          type: 'HS103',
          mid: toNumber(form.hs103_mid.value),
          end: toNumber(form.hs103_end.value),
          ta: toNumber(form.hs103_ta.value),
        },
    nso: {
      grade: toNumber(form.nso_grade.value),
    },
    hs101: {
      mini: toNumber(form.hs101_mini.value),
      end: toNumber(form.hs101_end.value),
      attendance: toNumber(form.hs101_att.value),
    },
  };
}

function clearForm(form) {
  Array.from(form.elements).forEach(el => {
    if (el.tagName === 'INPUT') {
      el.value = '';
    }
    if (el.tagName === 'SELECT' && el.name === 'hum_type') {
      el.value = 'HS102';
    }
  });
  document.getElementById('hs102-fields').style.display = '';
  document.getElementById('hs103-fields').style.display = 'none';
}

function renderResult(data) {
  const cgpaEl = document.getElementById('cgpa-value');
  const creditsEl = document.getElementById('total-credits');
  const gpEl = document.getElementById('total-gp');
  const tbody = document.querySelector('#courses-table tbody');
  const emptyRow = document.getElementById('courses-empty-row');

  if (!data || !data.courses) {
    cgpaEl.textContent = '--';
    creditsEl.textContent = '--';
    gpEl.textContent = '--';
    emptyRow.style.display = '';
    // Clear chart if present
    if (gradesChart) {
      gradesChart.destroy();
      gradesChart = null;
    }
    const chartCanvas = document.getElementById('grades-chart');
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    }
    return;
  }

  cgpaEl.textContent = data.cgpa.toFixed(3);
  creditsEl.textContent = data.totalCredits.toFixed(1);
  gpEl.textContent = data.totalGradePoints.toFixed(2);

  // Clear old rows except empty row
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    if (tr.id !== 'courses-empty-row') tbody.removeChild(tr);
  });

  const entries = Object.entries(data.courses);
  if (entries.length === 0) {
    emptyRow.style.display = '';
    if (gradesChart) {
      gradesChart.destroy();
      gradesChart = null;
    }
    return;
  }
  emptyRow.style.display = 'none';

  entries.forEach(([code, info]) => {
    const tr = document.createElement('tr');

    const tdCode = document.createElement('td');
    tdCode.textContent = code;

    const tdCredits = document.createElement('td');
    tdCredits.style.textAlign = 'center';
    const creditBadge = document.createElement('span');
    creditBadge.className = 'credit-badge';
    creditBadge.textContent = info.credits != null ? info.credits : '—';
    tdCredits.appendChild(creditBadge);

    const tdTotal = document.createElement('td');
    tdTotal.textContent =
      typeof info.total === 'number' ? info.total.toFixed(2) : '—';

    const tdGrade = document.createElement('td');
    const span = document.createElement('span');
    const grade = info.grade != null ? info.grade : '—';
    span.textContent = grade;
    span.className =
      grade === 0 ? 'grade-pill zero' : 'grade-pill';
    tdGrade.appendChild(span);

    tr.appendChild(tdCode);
    tr.appendChild(tdCredits);
    tr.appendChild(tdTotal);
    tr.appendChild(tdGrade);

    tbody.appendChild(tr);
  });

  // Update visual analysis chart
  try {
    const chartCanvas = document.getElementById('grades-chart');
    if (chartCanvas && typeof Chart !== 'undefined') {
      const labels = entries.map(([code]) => code);
      const grades = entries.map(([, info]) => {
        const g = info.grade;
        return typeof g === 'number' && Number.isFinite(g) ? g : 0;
      });

      if (gradesChart) {
        gradesChart.destroy();
        gradesChart = null;
      }

      const ctx = chartCanvas.getContext('2d');
      gradesChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Grade point',
              data: grades,
              backgroundColor: 'rgba(56, 189, 248, 0.6)',
              borderColor: 'rgba(56, 189, 248, 1)',
              borderWidth: 1,
              borderRadius: 4,
              maxBarThickness: 32,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  } catch (e) {
    // Fail silently if charting is unavailable; core CGPA functionality still works.
    console.error('Failed to render chart', e);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cgpa-form');
  const clearBtn = document.getElementById('clear-btn');
  const errorBanner = document.getElementById('error-banner');
  const humSelect = form.hum_type;

  humSelect.addEventListener('change', () => {
    const hs102 = document.getElementById('hs102-fields');
    const hs103 = document.getElementById('hs103-fields');
    if (humSelect.value === 'HS103') {
      hs102.style.display = 'none';
      hs103.style.display = '';
    } else {
      hs102.style.display = '';
      hs103.style.display = 'none';
    }
  });

  clearBtn.addEventListener('click', () => {
    clearForm(form);
    renderResult(null);
    errorBanner.style.display = 'none';
    errorBanner.textContent = '';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorBanner.style.display = 'none';
    errorBanner.textContent = '';

    const courseData = buildPayload(form);

    try {
      const payload = {
        userId: currentUserId,
        userName: currentUserName,
        userBranch: currentUserBranch,
        courseData,
      };

      const res = await fetch('/api/cgpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Unable to calculate CGPA');
      }

      renderResult(data);
    } catch (err) {
      errorBanner.textContent = err.message || 'Unexpected error';
      errorBanner.style.display = '';
    }
  });

  // Handle user registration
  const userForm = document.getElementById('user-form');
  const userModal = document.getElementById('user-modal');

  userForm.addEventListener('submit', async e => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const branch = document.getElementById('branch').value;

    if (!fullName || !branch) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, branch }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      currentUserId = data.userId;
      currentUserName = data.fullName;
      currentUserBranch = data.branch;

      userModal.classList.add('hidden');

      // Show user info
      const userInfo = document.createElement('div');
      userInfo.className = 'user-info';
      userInfo.innerHTML = `
        <span class="user-info-text"><strong>${currentUserName}</strong> • <span class="user-info-branch">${currentUserBranch}</span></span>
      `;
      form.parentElement.insertBefore(userInfo, form);
    } catch (err) {
      alert(err.message || 'Registration failed');
    }
  });
});
