import CodeRunner from './CodeRunner';
import './style.css'

// Create a map of dynamic imports
const dayModules = import.meta.glob('./20*/day*/*.ts');

const inputField = document.getElementById('input') as HTMLTextAreaElement;
const daySelect = document.getElementById('day') as HTMLSelectElement;
const form = document.querySelector('form') as HTMLFormElement;
const resultsCtn = document.getElementById('resultsContainer') as HTMLDivElement;
const runtimeElm = document.getElementById('runtime') as HTMLSpanElement;
const resultElm = document.getElementById('result') as HTMLParagraphElement;
const errorElm = document.getElementById('error') as HTMLParagraphElement;

form?.addEventListener('submit', async (e: SubmitEvent) => {
  e.preventDefault();
  resultsCtn.style.display = 'none';
  errorElm.style.display = 'none';

  try {
    const modulePath = `./${daySelect.value}.ts`;
    const module = await dayModules[modulePath]() as { default: new () => CodeRunner };
    const codeRunner = new module.default();
    const {performance, result} = codeRunner.run(inputField.value);
    runtimeElm.innerHTML = `${performance.toFixed(2)}ms`;
    colorCodePerformanceResult(performance);
    resultElm.innerHTML = `${result}`;
    resultsCtn.style.display = '';
  } catch (err: unknown) {
    console.error(err);
    let errMessage = '';
    if (typeof err === "string") {
      errMessage = err;
    } else if (err instanceof Error) {
      errMessage = err.message;
    }
    errorElm.innerHTML = errMessage;
    errorElm.style.display = '';
  }
});

function colorCodePerformanceResult(performance: number) {
  let color = '';

  if (performance < 10) {
    color = '#15d015'; // green
  } else if (performance < 100) {
    color = '#e89017'; // orange
  } else {
    color = '#e51313'; // red
  }

  runtimeElm.style.color = color;
}
