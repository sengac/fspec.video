/**
 * Simple proof-of-concept demo for fspec.videos recording
 */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function demo() {
  console.log('🎬 fspec.videos Demo Starting...');
  await sleep(1000);

  console.log('');
  console.log('This is a simple demonstration of the fspec.videos recording system.');
  await sleep(1500);

  console.log('');
  console.log('✅ Terminal output captured');
  await sleep(800);

  console.log('✅ Video encoding works');
  await sleep(800);

  console.log('✅ Demo completed successfully!');
  await sleep(1000);

  console.log('');
  console.log('🎉 Recording complete!');
  await sleep(1000);

  // Exit cleanly
  process.exit(0);
}

demo().catch(err => {
  console.error('Demo failed:', err);
  process.exit(1);
});
