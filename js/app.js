/* ==============================
   ATP-PAI: Application Logic
   ============================== */

// State
let userProfile = null;
let currentSection = 'about';

// ==============================
// Navigation
// ==============================

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active-section');
        currentSection = sectionId;
    }

    const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (navLink) navLink.classList.add('active');

    window.scrollTo({ top: section ? section.offsetTop - 80 : 0, behavior: 'smooth' });
}

// Nav click handlers
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(this.dataset.section);
    });
});

// Tab handlers
document.querySelectorAll('.tool-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const panelId = 'panel-' + this.dataset.tab;
        document.getElementById(panelId).classList.add('active');

        // Trigger animations on dashboard
        if (this.dataset.tab === 'dashboard') {
            animateDashboard();
        }
    });
});

// Scenario selector
document.querySelectorAll('.scenario-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('scenario-active'));
        this.classList.add('scenario-active');
        highlightScenario(this.dataset.scenario);
    });
});

// ==============================
// Module A: Functional Profiling
// ==============================

function generateProfile() {
    const profiles = getCheckedValues('profile');
    const supports = getCheckedValues('support');
    const prefs = getCheckedValues('prefs');
    const infoPrefs = getCheckedValues('info');
    const privacyPrefs = getCheckedValues('privacy');

    const assistance = document.getElementById('assistance-level').value;
    const destType = document.getElementById('dest-type').value;
    const tripDuration = document.getElementById('trip-duration').value;
    const season = document.getElementById('season').value;
    const dataRetention = document.getElementById('data-retention').value;

    if (profiles.length === 0) {
        alert('Please select at least one functional profile characteristic.');
        return;
    }

    userProfile = {
        profiles, supports, prefs, infoPrefs, privacyPrefs,
        assistance, destType, tripDuration, season, dataRetention
    };

    // Calculate complexity score
    const complexityScore = Math.min(10, profiles.length * 1.5 + supports.length + (assistance === 'continuous' ? 2 : assistance === 'regular' ? 1 : 0));
    const accessibilityNeed = complexityScore > 6 ? 'High' : complexityScore > 3 ? 'Medium' : 'Low';
    const riskLevel = complexityScore > 7 ? 'Elevated' : complexityScore > 4 ? 'Moderate' : 'Standard';

    // Build profile summary
    const resultEl = document.getElementById('profile-result');
    resultEl.style.display = 'block';
    resultEl.innerHTML = `
        <h4 style="margin-bottom:1rem;color:var(--primary-dark)"><i class="fas fa-user-check" style="color:var(--success);margin-right:0.5rem"></i> Functional Profile Generated</h4>

        <div class="profile-summary">
            <div class="summary-card" style="border-left-color:${accessibilityNeed === 'High' ? 'var(--danger)' : accessibilityNeed === 'Medium' ? 'var(--warning)' : 'var(--success)'}">
                <h5>Accessibility Need</h5>
                <div class="value">${accessibilityNeed}</div>
                <div class="sub">Composite score: ${complexityScore.toFixed(1)}/10</div>
            </div>
            <div class="summary-card">
                <h5>Functional Profiles</h5>
                <div class="value">${profiles.length}</div>
                <div class="sub">${profiles.map(p => formatLabel(p)).join(', ')}</div>
            </div>
            <div class="summary-card">
                <h5>Support Level</h5>
                <div class="value">${formatLabel(assistance)}</div>
                <div class="sub">${supports.length} support items selected</div>
            </div>
            <div class="summary-card" style="border-left-color:${riskLevel === 'Elevated' ? 'var(--danger)' : riskLevel === 'Moderate' ? 'var(--warning)' : 'var(--success)'}">
                <h5>Barrier Risk</h5>
                <div class="value">${riskLevel}</div>
                <div class="sub">Based on profile + context</div>
            </div>
        </div>

        <div class="gauge-row">
            ${createGauge('Autonomy Potential', Math.round(100 - complexityScore * 7), '#2e86c1')}
            ${createGauge('Personalization Need', Math.round(complexityScore * 10), '#8e44ad')}
            ${createGauge('Information Adaptation', Math.round(infoPrefs.length / 6 * 100), '#e67e22')}
            ${createGauge('Privacy Sensitivity', Math.round((3 - privacyPrefs.length) / 3 * 100), '#27ae60')}
        </div>

        <div style="margin-top:1.5rem;">
            <h5 style="margin-bottom:0.75rem;color:var(--primary)"><i class="fas fa-project-diagram"></i> Profile-to-Model Mapping (TAP-IAP Traceability)</h5>
            <div class="rec-tags" style="margin-bottom:1rem;">
                ${profiles.map(p => `<span class="rec-tag">${formatLabel(p)}</span>`).join('')}
                ${prefs.map(p => `<span class="rec-tag" style="background:#eafaf1;color:#27ae60">${formatLabel(p)}</span>`).join('')}
            </div>
            <table class="comparison-table" style="font-size:0.85rem">
                <thead>
                    <tr>
                        <th>TAP-IAP Component</th>
                        <th>Activation Status</th>
                        <th>Relevance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Intelligent Assistants</td>
                        <td><span style="color:var(--success)"><i class="fas fa-check-circle"></i> Active</span></td>
                        <td>${profiles.includes('cognitive') || profiles.includes('visual') ? '<strong>High</strong>' : 'Standard'}</td>
                    </tr>
                    <tr>
                        <td>Computer Vision / Barrier Recognition</td>
                        <td><span style="color:var(--success)"><i class="fas fa-check-circle"></i> Active</span></td>
                        <td>${profiles.includes('mobility') || profiles.includes('visual') ? '<strong>High</strong>' : 'Standard'}</td>
                    </tr>
                    <tr>
                        <td>Cognitive Adaptations</td>
                        <td><span style="color:${profiles.includes('cognitive') || profiles.includes('autism') ? 'var(--success)' : 'var(--warning)'}"><i class="fas fa-${profiles.includes('cognitive') || profiles.includes('autism') ? 'check-circle' : 'minus-circle'}"></i> ${profiles.includes('cognitive') || profiles.includes('autism') ? 'Active (Enhanced)' : 'Standby'}</span></td>
                        <td>${profiles.includes('cognitive') || profiles.includes('autism') ? '<strong>Critical</strong>' : 'Low'}</td>
                    </tr>
                    <tr>
                        <td>Recommendation Personalization</td>
                        <td><span style="color:var(--success)"><i class="fas fa-check-circle"></i> Active</span></td>
                        <td><strong>High</strong> (${prefs.length} preference areas)</td>
                    </tr>
                    <tr>
                        <td>Decision Explainability</td>
                        <td><span style="color:var(--success)"><i class="fas fa-check-circle"></i> Active</span></td>
                        <td>${infoPrefs.includes('easy-read') ? '<strong>Enhanced</strong> (easy-read mode)' : 'Standard'}</td>
                    </tr>
                    <tr>
                        <td>Bias Monitoring</td>
                        <td><span style="color:var(--success)"><i class="fas fa-check-circle"></i> Active</span></td>
                        <td>${profiles.length > 2 ? '<strong>Critical</strong> (intersectional profile)' : 'Standard'}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="callout callout-info" style="margin-top:1.5rem">
            <i class="fas fa-arrow-right"></i>
            <div>Profile generated successfully. Proceed to the <strong>Personalization Engine</strong> tab to generate AI-driven recommendations based on this profile.</div>
        </div>
    `;

    // Enable personalization tab
    document.getElementById('no-profile-warning').style.display = 'none';
    document.getElementById('personalization-content').style.display = 'block';

    // Animate gauges
    setTimeout(() => animateGauges(), 100);

    // Scroll to result
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==============================
// Module B: Personalization Engine
// ==============================

function generateRecommendations() {
    if (!userProfile) return;

    const intensity = document.getElementById('pers-intensity').value;
    const exploreSafety = document.getElementById('explore-safety').value;

    const recommendations = buildRecommendations(userProfile, intensity, exploreSafety);
    const resultEl = document.getElementById('recommendations-result');
    resultEl.style.display = 'block';

    resultEl.innerHTML = `
        <h4 style="margin-bottom:0.5rem;color:var(--primary-dark)"><i class="fas fa-magic" style="color:var(--accent);margin-right:0.5rem"></i> Personalized Recommendations</h4>
        <p style="font-size:0.9rem;color:var(--text-light);margin-bottom:1.25rem;">
            Generated with personalization intensity <strong>${intensity}/5</strong> and exploration-safety balance <strong>${exploreSafety}/5</strong>.
            Each recommendation includes full algorithmic traceability.
        </p>
        <div class="rec-list">
            ${recommendations.map(rec => renderRecommendation(rec)).join('')}
        </div>

        <div style="margin-top:2rem;">
            <h5 style="margin-bottom:1rem;color:var(--primary)"><i class="fas fa-chart-radar"></i> Recommendation Impact Projection</h5>
            <div class="gauge-row">
                ${createGauge('Autonomy Gain', Math.round(50 + intensity * 8 + Math.random() * 10), '#2e86c1')}
                ${createGauge('Barrier Anticipation', Math.round(40 + intensity * 10 + Math.random() * 10), '#27ae60')}
                ${createGauge('Satisfaction Est.', Math.round(55 + intensity * 7 + Math.random() * 8), '#8e44ad')}
                ${createGauge('Uncertainty Reduction', Math.round(45 + intensity * 9 + Math.random() * 10), '#e67e22')}
            </div>
        </div>
    `;

    setTimeout(() => animateGauges(), 100);
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildRecommendations(profile, intensity, exploreSafety) {
    const recs = [];
    const hasAccessibilityNeeds = profile.profiles.length > 0;
    const explorationFactor = exploreSafety / 5;

    if (profile.prefs.includes('cultural') || profile.prefs.length === 0) {
        recs.push({
            type: 'cultural',
            icon: 'fas fa-landmark',
            title: 'Accessible Heritage Route: Historic Quarter',
            description: 'A curated walking route through the historic center with verified accessible pathways, tactile models at key monuments, and audio descriptions in multiple languages. Real-time crowd monitoring adjusts the route to avoid congestion.',
            score: Math.round(78 + intensity * 4),
            tags: ['Wheelchair Accessible', 'Audio Described', 'Tactile Models', 'Crowd-Aware'],
            trace: {
                dataUsed: ['Functional profile: ' + profile.profiles.map(p => formatLabel(p)).join(', '), 'Preference: Cultural heritage', 'Context: ' + formatLabel(profile.destType || 'urban') + ', ' + formatLabel(profile.season || 'shoulder') + ' season'],
                reasoning: 'Route selected based on verified accessibility audit data (updated Jan 2026). Pathway gradient analysis confirms wheelchair accessibility (<5% incline). Audio descriptions activated based on visual impairment profile. Crowd monitoring factor weighted higher due to ' + formatLabel(profile.season || 'high') + ' season selection.',
                adaptations: profile.profiles.includes('cognitive') ? ['Easy-read interpretive panels', 'Pictographic wayfinding', 'Simplified historical narratives'] : profile.profiles.includes('visual') ? ['Audio guide with spatial orientation cues', 'Tactile maps at decision points', 'Companion navigation mode'] : ['Standard accessibility provisions', 'Real-time barrier alerts', 'Alternative route options'],
                ethicalNote: 'Recommendation does not infer disability type beyond user-provided profile. Route diversity score: 0.84 (above fairness threshold).'
            }
        });
    }

    if (profile.prefs.includes('nature') || explorationFactor > 0.6) {
        recs.push({
            type: 'nature',
            icon: 'fas fa-tree',
            title: 'Inclusive Nature Experience: Coastal Sensory Trail',
            description: 'An accessible nature trail along the coast with multi-sensory stations (sound, scent, touch), accessible viewing platforms, and a companion app providing real-time barrier information and alternative paths.',
            score: Math.round(70 + intensity * 3 + explorationFactor * 8),
            tags: ['Accessible Trail', 'Sensory Stations', 'Real-time Info', 'Rest Points'],
            trace: {
                dataUsed: ['Functional profile: ' + profile.profiles.map(p => formatLabel(p)).join(', '), 'Preference: Nature & outdoor', 'Support level: ' + formatLabel(profile.assistance), 'Exploration preference: ' + exploreSafety + '/5'],
                reasoning: 'Trail selected from accessible outdoor options database. Gradient analysis: maximum 6% incline with rest points every 200m. Sensory stations match multisensory engagement criteria. Safety score adjusted for assistance level (' + formatLabel(profile.assistance) + '). Weather-contingent accessibility verified.',
                adaptations: profile.profiles.includes('mobility') ? ['Motorized wheelchair loan available', 'Hardened surface paths', 'Accessible viewing platforms'] : profile.profiles.includes('hearing') ? ['Visual alert stations', 'Vibrotactile navigation markers', 'Written interpretation panels'] : ['Adaptive pacing recommendations', 'Personalized sensory engagement levels', 'Emergency support geolocation'],
                ethicalNote: 'Trail difficulty assessment uses non-deficit framing. Users are presented with capability-matched options rather than exclusion-based filtering.'
            }
        });
    }

    if (profile.prefs.includes('gastronomy')) {
        recs.push({
            type: 'gastro',
            icon: 'fas fa-utensils',
            title: 'Accessible Gastronomy: Inclusive Food Tour',
            description: 'A food tour featuring restaurants verified for physical accessibility, menus in accessible formats (easy-read, pictographic, Braille), staff trained in disability awareness, and dietary adaptation for diverse needs.',
            score: Math.round(74 + intensity * 3),
            tags: ['Verified Venues', 'Accessible Menus', 'Trained Staff', 'Dietary Adapted'],
            trace: {
                dataUsed: ['Functional profile: ' + profile.profiles.map(p => formatLabel(p)).join(', '), 'Preference: Gastronomy', 'Information preferences: ' + (profile.infoPrefs.length > 0 ? profile.infoPrefs.map(i => formatLabel(i)).join(', ') : 'Standard')],
                reasoning: 'Venues selected from verified accessibility database. Each venue has been audited within the last 6 months. Menu accessibility formats matched to user information preferences. Staff training certification verified. Venue sequence optimized for accessible transport links.',
                adaptations: profile.profiles.includes('cognitive') ? ['Pictographic menus', 'Simple ordering process', 'Quiet time options'] : ['Accessible format menus', 'Allergy-aware preparation', 'Flexible timing'],
                ethicalNote: 'Venue recommendations ensure geographic and price diversity. Algorithm avoids concentrating recommendations in a narrow price range that could reinforce socioeconomic bias.'
            }
        });
    }

    if (profile.prefs.includes('wellness')) {
        recs.push({
            type: 'wellness',
            icon: 'fas fa-spa',
            title: 'Adaptive Wellness: Inclusive Relaxation Program',
            description: 'A personalized wellness program with accessible spa facilities, adapted therapeutic activities, sensory-friendly environments, and trained therapists experienced in working with diverse functional profiles.',
            score: Math.round(82 + intensity * 2),
            tags: ['Adaptive Equipment', 'Sensory-Friendly', 'Trained Therapists', 'Privacy-Centered'],
            trace: {
                dataUsed: ['Functional profile: ' + profile.profiles.map(p => formatLabel(p)).join(', '), 'Preference: Wellness', 'Privacy settings: ' + formatLabel(profile.dataRetention)],
                reasoning: 'Facility selected based on accessibility certification and adaptive equipment availability. Therapist training in disability-aware service delivery verified. Sensory environment can be customized (lighting, sound, temperature). Privacy settings respected: health-related data not shared with venue.',
                adaptations: ['Personalized session duration', 'Accessible changing facilities', 'Communication preference accommodation'],
                ethicalNote: 'Wellness recommendations avoid medicalizing disability. Focus is on wellbeing and personal choice, not therapeutic intervention for the disability itself.'
            }
        });
    }

    // Always add at least one generic rec if empty
    if (recs.length === 0) {
        recs.push({
            type: 'cultural',
            icon: 'fas fa-map-marked-alt',
            title: 'Personalized Accessible City Tour',
            description: 'A customized city tour adapted to your functional profile, with verified accessible routes, real-time barrier monitoring, multimodal information delivery, and continuous support options.',
            score: Math.round(75 + intensity * 3),
            tags: ['Accessible Route', 'Real-time Adapted', 'Multimodal Info', 'Support Available'],
            trace: {
                dataUsed: ['Functional profile: ' + profile.profiles.map(p => formatLabel(p)).join(', '), 'Support level: ' + formatLabel(profile.assistance), 'Context: ' + formatLabel(profile.destType || 'urban')],
                reasoning: 'Default accessible tour generated based on functional profile analysis. Route optimized for minimal barriers and maximum engagement. Information delivery adapted to user preferences.',
                adaptations: ['Profile-specific route optimization', 'Adaptive information presentation', 'Flexible pacing'],
                ethicalNote: 'Generic recommendation ensures all users receive meaningful suggestions regardless of preference selection.'
            }
        });
    }

    return recs;
}

function renderRecommendation(rec) {
    return `
        <div class="rec-card">
            <div class="rec-icon ${rec.type}">
                <i class="${rec.icon}"></i>
            </div>
            <div class="rec-body">
                <h5>${rec.title}</h5>
                <p>${rec.description}</p>
                <div class="rec-tags">
                    ${rec.tags.map(t => `<span class="rec-tag">${t}</span>`).join('')}
                </div>
                <details class="trace-block">
                    <summary><i class="fas fa-search"></i> Why this recommendation? (Algorithmic Traceability)</summary>
                    <div class="trace-content">
                        <strong>Data Used:</strong>
                        <ul>${rec.trace.dataUsed.map(d => `<li>${d}</li>`).join('')}</ul>
                        <strong>Reasoning:</strong>
                        <p>${rec.trace.reasoning}</p>
                        <strong>Profile-Specific Adaptations:</strong>
                        <ul>${rec.trace.adaptations.map(a => `<li>${a}</li>`).join('')}</ul>
                        <strong>Ethical Note:</strong>
                        <p><em>${rec.trace.ethicalNote}</em></p>
                    </div>
                </details>
            </div>
            <div class="rec-score">
                <div class="score-circle ${rec.score >= 80 ? 'score-high' : 'score-med'}">${rec.score}%</div>
                <span class="score-label">Match Score</span>
            </div>
        </div>
    `;
}

// ==============================
// Module D: Dashboard Animations
// ==============================

function animateDashboard() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = width; }, 100);
    });
}

function highlightScenario(scenario) {
    const rows = document.querySelectorAll('.bar-row');
    rows.forEach(row => {
        const label = row.querySelector('.bar-label');
        if (!label) return;
        const text = label.textContent.trim();

        if (scenario === 'baseline' && text === 'Scenario A') row.style.opacity = '1';
        else if (scenario === 'partial' && text === 'Scenario B') row.style.opacity = '1';
        else if (scenario === 'full' && text === 'Scenario C') row.style.opacity = '1';

        // Dim non-selected
        if (scenario === 'baseline' && text !== 'Scenario A') row.style.opacity = '0.4';
        else if (scenario === 'partial' && text !== 'Scenario B') row.style.opacity = '0.4';
        else if (scenario === 'full' && text !== 'Scenario C') row.style.opacity = '0.4';

        // Reset if clicking the same
        if (!scenario) row.style.opacity = '1';
    });

    // Reset all on double-click behavior
    setTimeout(() => {
        rows.forEach(row => row.style.opacity = '1');
    }, 3000);
}

// ==============================
// Module D: Report Export
// ==============================

function exportReport() {
    const reportContent = generateReportHTML();
    const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TAP-IAP_Governance_Report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateReportHTML() {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const profileSummary = userProfile
        ? `Profiles: ${userProfile.profiles.map(p => formatLabel(p)).join(', ')} | Assistance: ${formatLabel(userProfile.assistance)} | Destination: ${formatLabel(userProfile.destType || 'Not specified')}`
        : 'No user profile configured for this report.';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TAP-IAP Governance Report</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 2rem; color: #2c3e50; line-height: 1.7; }
        h1 { color: #1a5276; border-bottom: 3px solid #2e86c1; padding-bottom: 0.5rem; font-size: 1.5rem; }
        h2 { color: #2e86c1; margin-top: 2rem; font-size: 1.2rem; }
        h3 { color: #1a5276; font-size: 1rem; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
        th { background: #1a5276; color: white; padding: 0.6rem 0.8rem; text-align: left; }
        td { padding: 0.5rem 0.8rem; border-bottom: 1px solid #d5dbdb; }
        tr:hover { background: #eaf2f8; }
        .meta { color: #5d6d7e; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
        .improve { color: #27ae60; font-weight: 700; }
        .note { background: #f4f6f7; border-left: 4px solid #2e86c1; padding: 0.8rem 1rem; margin: 1rem 0; font-size: 0.88rem; }
        .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #d5dbdb; font-size: 0.82rem; color: #5d6d7e; }
    </style>
</head>
<body>
    <h1>TAP-IAP Model: Governance Report</h1>
    <p class="meta">Generated: ${date} | Framework: Accessible Tourism Powered by Personalized AI (TAP-IAP)</p>

    <h2>1. Profile Summary</h2>
    <p>${profileSummary}</p>

    <h2>2. Scenario Comparison: Key Indicators</h2>
    <table>
        <thead>
            <tr><th>Indicator</th><th>A: Baseline</th><th>B: Partial</th><th>C: Full TAP-IAP</th><th>Improvement</th></tr>
        </thead>
        <tbody>
            <tr><td>Uncertainty Reduction</td><td>25%</td><td>58%</td><td>84%</td><td class="improve">+59 pp</td></tr>
            <tr><td>Perceived Autonomy</td><td>3.5/10</td><td>5.6/10</td><td>8.1/10</td><td class="improve">+4.6 pts</td></tr>
            <tr><td>Barriers Anticipated</td><td>15%</td><td>52%</td><td>89%</td><td class="improve">+74 pp</td></tr>
            <tr><td>Accessibility Incidents</td><td>7.8</td><td>4.5</td><td>2.1</td><td class="improve">-73%</td></tr>
            <tr><td>Overall Satisfaction</td><td>4.2/10</td><td>6.3/10</td><td>8.5/10</td><td class="improve">+4.3 pts</td></tr>
            <tr><td>Recommendation Equity</td><td>N/A</td><td>0.61</td><td>0.88</td><td class="improve">+0.27</td></tr>
        </tbody>
    </table>

    <h2>3. Algorithmic Accessibility Compliance</h2>
    <table>
        <thead>
            <tr><th>Dimension</th><th>Score</th><th>Status</th></tr>
        </thead>
        <tbody>
            <tr><td>Demographic Parity</td><td>0.87</td><td>Pass</td></tr>
            <tr><td>Equalized Odds</td><td>0.82</td><td>Pass</td></tr>
            <tr><td>Recommendation Coverage</td><td>0.91</td><td>Pass</td></tr>
            <tr><td>Intersectional Fairness</td><td>0.75</td><td>Below Threshold</td></tr>
        </tbody>
    </table>

    <div class="note">
        <strong>Action Required:</strong> Intersectional fairness score (0.75) is below the recommended threshold of 0.80.
        Recommendation: expand training data for users with combined disability profiles and conduct targeted fairness audits.
    </div>

    <h2>4. Governance Recommendations</h2>
    <ul>
        <li>Integrate algorithmic accessibility standards into destination smart tourism certification frameworks.</li>
        <li>Establish co-design protocols with disability organizations for system development and evaluation.</li>
        <li>Implement regular algorithmic impact assessments as preventive governance tools.</li>
        <li>Develop intersectional fairness benchmarks specific to tourism accessibility contexts.</li>
        <li>Ensure data portability and right-to-explanation compliance in all AI-mediated tourism services.</li>
    </ul>

    <h2>5. Research Hypotheses for Empirical Validation</h2>
    <table>
        <thead>
            <tr><th>Hypothesis</th><th>TAP-IAP Component</th><th>Suggested Method</th></tr>
        </thead>
        <tbody>
            <tr><td>H1: AI-driven personalization reduces pre-trip uncertainty for travelers with disabilities</td><td>Inclusive Technology Modules</td><td>Pre/post experimental design</td></tr>
            <tr><td>H2: Explainable recommendations increase perceived autonomy</td><td>Ethical Algorithmic Personalization</td><td>A/B testing with transparency conditions</td></tr>
            <tr><td>H3: Barrier anticipation systems reduce on-trip accessibility incidents</td><td>Inclusive Technology Modules</td><td>Field pilot with incident logging</td></tr>
            <tr><td>H4: User control over personalization enhances sense of dignity</td><td>Tourism Experience Mediators</td><td>Mixed-methods (surveys + interviews)</td></tr>
            <tr><td>H5: Intersectional fairness auditing reduces recommendation bias</td><td>Ethical Algorithmic Personalization</td><td>Counterfactual algorithmic testing</td></tr>
        </tbody>
    </table>

    <div class="footer">
        <p><strong>TAP-IAP Framework:</strong> Accessible Tourism Powered by Personalized AI.</p>
        <p>This report is generated as part of a proof-of-concept operationalization. Indicator values are hypothetical projections for ex ante evaluation purposes.</p>
        <p>Based on: <em>Personalized AI and Accessible Tourism: Conceptual Framework and Operationalization for Advancing Rights, Autonomy, and Participation</em>.</p>
    </div>
</body>
</html>`;
}

// ==============================
// Utility Functions
// ==============================

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function formatLabel(value) {
    if (!value) return '';
    const labels = {
        'mobility': 'Reduced mobility',
        'visual': 'Visual impairment',
        'hearing': 'Hearing impairment',
        'cognitive': 'Cognitive disability',
        'autism': 'Autism spectrum',
        'psychosocial': 'Psychosocial disability',
        'elderly': 'Age-related',
        'temporary': 'Temporary impairment',
        'independent': 'Fully independent',
        'occasional': 'Occasional support',
        'regular': 'Regular support',
        'continuous': 'Continuous support',
        'companion': 'Companion/carer',
        'guide-dog': 'Assistance animal',
        'wheelchair': 'Wheelchair/mobility device',
        'communication': 'AAC user',
        'cultural': 'Cultural heritage',
        'nature': 'Nature & outdoor',
        'gastronomy': 'Gastronomy',
        'wellness': 'Wellness',
        'adventure': 'Adventure',
        'social': 'Social events',
        'urban': 'Urban',
        'coastal': 'Coastal',
        'rural': 'Rural',
        'mountain': 'Mountain',
        'historic': 'Historic site',
        'day': 'Day trip',
        'weekend': 'Weekend',
        'week': 'One week',
        'extended': 'Extended stay',
        'high': 'High season',
        'shoulder': 'Shoulder season',
        'low': 'Low season',
        'easy-read': 'Easy-read',
        'visual': 'Visual/pictographic',
        'audio': 'Audio descriptions',
        'sign-lang': 'Sign language',
        'high-contrast': 'High contrast',
        'large-text': 'Large text',
        'session': 'Session only',
        'trip': 'Trip duration',
        'persistent': 'Persistent'
    };
    return labels[value] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
}

function createGauge(label, value, color) {
    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (value / 100) * circumference;

    return `
        <div class="gauge-item">
            <div style="position:relative;width:100px;height:100px;">
                <svg class="gauge-svg" viewBox="0 0 100 100">
                    <circle class="gauge-bg" cx="50" cy="50" r="38"></circle>
                    <circle class="gauge-fill" cx="50" cy="50" r="38"
                        stroke="${color}"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${circumference}"
                        data-target="${offset}"></circle>
                </svg>
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(0deg);font-size:1.1rem;font-weight:700;color:${color};">${value}%</div>
            </div>
            <span class="gauge-label">${label}</span>
        </div>
    `;
}

function animateGauges() {
    document.querySelectorAll('.gauge-fill').forEach(circle => {
        const target = circle.getAttribute('data-target');
        if (target) {
            setTimeout(() => {
                circle.style.strokeDashoffset = target;
            }, 200);
        }
    });
}

// ==============================
// Hero Animated Counters
// ==============================

function animateCounters() {
    document.querySelectorAll('.hero-stat-num').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500;
        const step = Math.max(1, Math.floor(target / (duration / 50)));
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = current;
        }, 50);
    });
}

// ==============================
// Radar Dot Tooltips
// ==============================

function initRadarTooltips() {
    const svg = document.getElementById('radar-chart');
    if (!svg) return;

    const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tooltip.setAttribute('id', 'radar-tooltip');
    tooltip.style.display = 'none';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('rx', '4');
    rect.setAttribute('ry', '4');
    rect.setAttribute('fill', '#1a5276');
    rect.setAttribute('opacity', '0.95');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '600');
    text.setAttribute('text-anchor', 'middle');

    tooltip.appendChild(rect);
    tooltip.appendChild(text);
    svg.appendChild(tooltip);

    document.querySelectorAll('.radar-dot').forEach(dot => {
        dot.addEventListener('mouseenter', function() {
            const label = this.getAttribute('data-label');
            const cx = parseFloat(this.getAttribute('cx'));
            const cy = parseFloat(this.getAttribute('cy'));

            text.textContent = label;
            const bbox = text.getBBox ? text.getBBox() : { width: label.length * 7, height: 14 };
            const pw = bbox.width + 16;
            const ph = 24;

            rect.setAttribute('width', pw);
            rect.setAttribute('height', ph);
            rect.setAttribute('x', cx - pw / 2);
            rect.setAttribute('y', cy - ph - 12);
            text.setAttribute('x', cx);
            text.setAttribute('y', cy - ph / 2 - 5);

            tooltip.style.display = 'block';
        });

        dot.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    });
}

// ==============================
// Initialization
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    // Animate hero counters
    animateCounters();

    // Init radar tooltips
    initRadarTooltips();
    // Animate progress bars on visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.progress-fill').forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => { fill.style.width = width; }, 200);
                });
                entry.target.querySelectorAll('.bar-fill').forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => { fill.style.width = width; }, 200);
                });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.access-card, .indicator-card, .comparison-summary').forEach(el => {
        observer.observe(el);
    });
});
