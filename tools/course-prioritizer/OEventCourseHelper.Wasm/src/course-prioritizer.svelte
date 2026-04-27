<svelte:options customElement={{ tag: "course-prioritizer", shadow: "none" }} />

<script>
  import { onMount } from "svelte";

  const base64Alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

  let engine = $state(null);
  let currentFileBytes = $state(null);
  let currentStep = $state("loading");
  let loadingText = $state("Loading .NET WebAssembly Engine...");

  let courses = $state([]);
  let selectedCourses = $state([]);
  let beamWidth = $state(3);
  let strictMode = $state(false);
  let engineOutput = $state(null);

  onMount(async () => {
    try {
      engine = await window.initializeEngineAsync();

      const urlParams = new URLSearchParams(window.location.search);
      const sharedResult = urlParams.get("result");

      if (sharedResult) {
        const parsedResult = await decompressFromBase64(sharedResult);
        showResults(parsedResult);
      } else {
        currentStep = "upload";
      }
    } catch (err) {
      alert(`Failed to initialize .NET WebAssembly Engine: ${err.message}`);
    }
  });

  async function compressToBase64(data) {
    const stream = new Blob([JSON.stringify(data)])
      .stream()
      .pipeThrough(new CompressionStream("gzip"));
    const buffer = await new Response(stream).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let output = "";
    let i = 0;

    for (i = 0; i < bytes.length - 2; i += 3) {
      output += base64Alphabet[bytes[i] >> 2];
      output += base64Alphabet[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      output +=
        base64Alphabet[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      output += base64Alphabet[bytes[i + 2] & 63];
    }

    if (i < bytes.length) {
      output += base64Alphabet[bytes[i] >> 2];
      if (i === bytes.length - 1) {
        output += base64Alphabet[(bytes[i] & 3) << 4];
      } else {
        output += base64Alphabet[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        output += base64Alphabet[(bytes[i + 1] & 15) << 2];
      }
    }

    return output;
  }

  async function decompressFromBase64(base64) {
    const lookup = new Uint8Array(256);
    for (let i = 0; i < base64Alphabet.length; i++) {
      lookup[base64Alphabet.charCodeAt(i)] = i;
    }

    const len = base64.length;
    const bytes = new Uint8Array(Math.floor((len * 3) / 4));
    let p = 0;
    for (let i = 0; i < len; i += 4) {
      const b1 = lookup[base64.charCodeAt(i)];
      const b2 = lookup[base64.charCodeAt(i + 1)];
      const b3 = lookup[base64.charCodeAt(i + 2)];
      const b4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = (b1 << 2) | (b2 >> 4);
      if (i + 2 < len) bytes[p++] = ((b2 & 15) << 4) | (b3 >> 2);
      if (i + 3 < len) bytes[p++] = ((b3 & 3) << 6) | b4;
    }

    const ds = new DecompressionStream("gzip");
    const decompressedStream = new Blob([bytes]).stream().pipeThrough(ds);

    const response = new Response(decompressedStream);
    const text = await response.text();
    return JSON.parse(text);
  }

  async function handleFileUpload(file) {
    if (!file || !engine) {
      return;
    }

    loadingText = "Parsing Courses...";
    currentStep = "loading";

    try {
      const arrayBuffer = await file.arrayBuffer();
      currentFileBytes = new Uint8Array(arrayBuffer);

      const namesResult =
        engine.OEventCourseHelper.Wasm.CourseListBridge.GetCourseNames(
          currentFileBytes,
        );

      if (namesResult[0] !== "SUCCESS") {
        throw new Error(namesResult.slice(1).join(", "));
      }

      courses = namesResult.slice(1);
      selectedCourses = [...courses];
      currentStep = "configure";
    } catch (err) {
      alert(`Error reading file: ${err.message}`);
      currentStep = "upload";
    }
  }

  function runPrioritization() {
    loadingText = "Prioritizing Courses...";
    currentStep = "loading";

    setTimeout(async () => {
      try {
        const result = engine.OEventCourseHelper.Wasm.EngineBridge.Prioritize(
          currentFileBytes,
          beamWidth,
          strictMode,
          selectedCourses,
        );

        if (result.success) {
          const encoded = await compressToBase64(result);
          const newUrl = new URL(window.location);
          newUrl.searchParams.set("result", encoded);
          window.history.pushState({}, "", newUrl);
        }

        showResults(result);
      } catch (err) {
        alert(`Engine Error: ${err.message}`);
        currentStep = "configure";
      }
    }, 100);
  }

  function showResults(result) {
    if (result.success) {
      engineOutput = result;
    } else {
      const msgs = result.error.messages;
      alert(
        `Error [${result.error.type}]:\n${Array.isArray(msgs) ? msgs.join("\n") : msgs}`,
      );
    }
    currentStep = "complete";
  }

  function reset() {
    window.history.pushState({}, "", window.location.pathname);
    currentFileBytes = null;
    currentStep = "upload";
  }

  async function copyShareUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy link.");
    }
  }
</script>

<h2>Course Prioritizer</h2>

{#if currentStep === "loading"}
  <svg
    class="spinner"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
  <h3>{loadingText}</h3>
{/if}

{#if currentStep === "upload"}
  <p>Upload an IOF 3.0 XML file to begin.</p>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <p>
    <strong>Drag & Drop your IOF XML file here</strong> or click to browse
  </p>
  <input
    type="file"
    id="xml-upload"
    accept=".xml"
    onchange={(e) => {
      if (e.target.files.length) {
        handleFileUpload(e.target.files[0]);
      }
    }}
  />
{/if}

{#if currentStep === "configure"}
  <h3>Configuration</h3>
  <p>Select Courses to Include:</p>
  {#each courses as course}
    <label style="display: block;">
      <input type="checkbox" value={course} bind:group={selectedCourses} />
      {course}
    </label>
  {/each}
  <label for="beam-width">Beam Width:</label>
  <input type="number" bind:value={beamWidth} min="1" max="10" />
  <label>
    <input type="checkbox" bind:checked={strictMode} />
    Strict Mode
  </label>
  <button onclick={runPrioritization}>Run Prioritizer</button>
  <button onclick={() => (currentStep = "upload")}>Cancel</button>
{/if}

{#if currentStep === "complete"}
  <h3>Prioritization Result</h3>
  {#if engineOutput.success}
    <h4>Summary</h4>
    <p>
      Total courses: {engineOutput.summary.totalCourseCount}<br />
      Required courses: {engineOutput.summary.requiredCourseCount}<br />
      Control count: {engineOutput.summary.totalControlCount}<br />
      Covered controls: {engineOutput.summary.visitedControlCount}<br />
    </p>
    {#if engineOutput.validationInfo.skippedControls.length > 0}
      <h4>Skipped controls</h4>
      <ul>
        {#each engineOutput.validationInfo.skippedControls as skippedControl}
          <li>{skippedControl}</li>
        {/each}
      </ul>
    {/if}
    <h4>Course priority</h4>
    <ol>
      {#each engineOutput.priorityOrder as prioritizedCourse}
        <li>
          {prioritizedCourse.courseName}{prioritizedCourse.required
            ? " (required)"
            : ""}
        </li>
      {/each}
    </ol>
    <button onclick={copyShareUrl}>Copy Share Link</button>
  {:else}
    <h4>{engineOutput.error.code} - {engineOutput.error.type}</h4>
    <ul>
      {#each engineOutput.error.messages as message}
        <li>{message}</li>
      {/each}
    </ul>
  {/if}
  <button onclick={reset}>Start Over</button>
{/if}
