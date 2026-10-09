export interface SampleConversation {
  id: string;
  name: string;
  description: string;
  defaultUserName: string;
  defaultAliases: string[];
  transcript: string;
}

export const SAMPLE_COLLEGE_SPRINT: SampleConversation = {
  id: 'college-sprint',
  name: 'CS Capstone Sprint (College Team)',
  description: '4 members • Final pitch deck, demo video, hardware pricing deadline',
  defaultUserName: 'Alex Rivera',
  defaultAliases: ['Alex', 'Alex Rivera', '@Alex', '@arivera'],
  transcript: `[09:12 AM] Maya Chen: Hey sprint team! Final pitch deck check-in. Did everyone get their assigned slides merged?
[09:14 AM] Alex Rivera: Yeah, Section 3 architecture diagram is finished and pushed to GitHub repo.
[09:15 AM] Liam Vance: Wait, does the financial model include local compute hardware amortizations?
[09:17 AM] Maya Chen: @Alex Rivera can you review Liam's hardware pricing table before 1:00 PM today? We need to submit before the faculty portal shuts down.
[09:21 AM] Chloe Scott: Linear ticket #144 for privacy benchmarks is marked completed. Zero remote dependencies.
[09:24 AM] Alex Rivera: On it! I will audit the amortization numbers right after lunch.
[09:40 AM] Jordan Lee: Did anyone confirm if Prof. Henderson needs physical handouts or is digital upload on Canvas sufficient?
[10:15 AM] Maya Chen: Let's stick with local SQLite for the demo, zero cloud cost and guaranteed sub-10ms response.
[10:18 AM] Jordan Lee: Agreed. Final 7-minute presentation sequence locked: Jordan does Intro, Alex handles UX Demo, Dev presents Tech Stack.
[10:30 AM] Chloe Scott: Free pizza arrived in the engineering lounge on floor 2 if anyone is hungry! 🍕
[10:32 AM] Liam Vance: Awesome, grabbing a slice now. Thanks Chloe!`,
};

export const SAMPLE_WAR_ROOM: SampleConversation = {
  id: 'war-room',
  name: 'Engineering War-Room (Production Deploy)',
  description: '5 members • API Gateway CORS blocker, release sign-off, staging smoke test',
  defaultUserName: 'Alex Rivera',
  defaultAliases: ['Alex', 'Alex Rivera', '@Alex'],
  transcript: `[10:14 AM] Jordan: Deploying release candidate v2.4 today for beta users.
[10:16 AM] Alex Rivera: Pushed final metrics to Linear #402. All integration tests green.
[10:19 AM] Dev: Still getting 403 Preflight on /v1/summary. Digging into AWS CORS preflight handlers now.
[10:22 AM] Jordan: @Alex Rivera can you verify user session token expiration before 3:00 PM deploy? We cannot ship if auth leaks.
[10:25 AM] Sarah: Has QA verified mobile Safari viewport scaling yet?
[10:31 AM] Maya: Let's lock API v2 contract to JSON-only endpoints. No XML backward compatibility needed.
[10:35 AM] Dev: CORS patch ready in PR #89. Will merge immediately after review.
[10:45 AM] Sarah: Just brewed fresh espresso in the breakroom if anyone needs caffeine.`,
};

export const SAMPLE_CASUAL_LUNCH: SampleConversation = {
  id: 'casual-lunch',
  name: 'Social Lunch & Coffee Chat',
  description: 'Zero blockers • Demonstrates clean filtering of chit-chat without false tasks',
  defaultUserName: 'Alex Rivera',
  defaultAliases: ['Alex', 'Alex Rivera'],
  transcript: `[11:45 AM] Sam: Anyone free for Thai food today around 12:30?
[11:47 AM] Taylor: Sounds great! The new curry spot on 4th street has good lunch specials.
[11:50 AM] Alex Rivera: I'm down. Count me in for spicy pad thai.
[11:52 AM] Sam: Nice, see you all in the lobby in 30 minutes!
[12:28 PM] Chris: Just walking down the stairs now.
[12:30 PM] Taylor: Here! Table is ready outside.`,
};

export const ALL_SAMPLES = [
  SAMPLE_COLLEGE_SPRINT,
  SAMPLE_WAR_ROOM,
  SAMPLE_CASUAL_LUNCH,
];
