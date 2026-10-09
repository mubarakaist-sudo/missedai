import { analyzeConversation } from './src/utils/analyzer.ts';
import { SAMPLE_COLLEGE_SPRINT, SAMPLE_CASUAL_LUNCH } from './src/utils/samples.ts';
import assert from 'node:assert';

console.log('Testing MissedIt AI Analyzer against PRD Acceptance Criteria...');

// 1. Test College Capstone Sprint
const sprintResult = analyzeConversation(
  SAMPLE_COLLEGE_SPRINT.transcript,
  'Alex Rivera',
  ['Alex', 'Alex Rivera', '@Alex', '@arivera']
);

console.log('--- Sample 1: College Sprint ---');
console.log('Speakers detected:', sprintResult.summary.speakers);
console.log('Total tasks extracted:', sprintResult.allTasks.length);
console.log('User tasks extracted:', sprintResult.userTasks.length);
console.log('Decisions extracted:', sprintResult.decisions.length);
console.log('Unresolved questions:', sprintResult.unresolvedQuestions.length);
console.log('Urgent items:', sprintResult.urgentItems.length);

// Criteria 4: detects at least one deadline, one assignment, one decision
assert(sprintResult.allTasks.some(t => t.deadline), 'Must detect at least one deadline');
assert(sprintResult.userTasks.length > 0, 'Must detect at least one assignment for Alex Rivera');
assert(sprintResult.decisions.length > 0, 'Must detect at least one decision');
assert(sprintResult.unresolvedQuestions.length > 0, 'Must detect unresolved question');

// Criteria 5: Each finding displays source evidence
sprintResult.allTasks.forEach(task => {
  assert(task.sourceMessage && task.sourceMessage.text, `Task ${task.id} must have source message evidence`);
});
sprintResult.decisions.forEach(decision => {
  assert(decision.sourceMessage && decision.sourceMessage.text, `Decision ${decision.id} must have source evidence`);
});
sprintResult.unresolvedQuestions.forEach(q => {
  assert(q.sourceMessage && q.sourceMessage.text, `Question ${q.id} must have source evidence`);
});

// Criteria 6: Casual messages are not incorrectly presented as confirmed tasks
const hasPizzaTask = sprintResult.allTasks.some(t => /pizza/i.test(t.title) || /slice/i.test(t.title));
assert(!hasPizzaTask, 'Pizza chatter must NOT be converted into a confirmed task!');

console.log('✓ Sample 1 assertions passed!');

// 2. Test Casual Lunch Chat (All Clear state)
const lunchResult = analyzeConversation(
  SAMPLE_CASUAL_LUNCH.transcript,
  'Alex Rivera',
  ['Alex', 'Alex Rivera']
);

console.log('--- Sample 2: Casual Lunch Chat ---');
console.log('Tasks details:', JSON.stringify(lunchResult.allTasks, null, 2));
console.log('Is All Clear:', lunchResult.isAllClear);
console.log('Tasks extracted:', lunchResult.allTasks.length);
console.log('Urgent items:', lunchResult.urgentItems.length);

assert(lunchResult.isAllClear === true, 'Casual lunch chat must result in All Clear');
assert(lunchResult.urgentItems.length === 0, 'Casual lunch chat must have 0 urgent items');

console.log('✓ Sample 2 assertions passed!');

console.log('\n🎉 ALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
