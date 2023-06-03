export function createSVGScript(code, head) {
  // create the script
  const script = document.createElement('script');
  const mainId = Math.round(Math.random() * 10_000);

  // Since the script is applied in the global context, we create
  // a unique name.  Even though only one should ever be loaded at
  // any given time, this feels a little cleaner.
  const functionName = `main_${mainId}`;

  script.id = 'svg-script';
  script.textContent = code.replace(
    'function main',
    `function ${functionName}`
  );

  // append the script to the head
  head.appendChild(script);

  return functionName;
}

export function removeSVGScript(head) {
  // the existing user script
  const currentScript = head.querySelector('#svg-script');

  // remove the current script
  if (currentScript) {
    currentScript.parentNode.removeChild(currentScript);
  }
}
