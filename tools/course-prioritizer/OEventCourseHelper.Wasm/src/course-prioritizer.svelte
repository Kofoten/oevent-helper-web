<svelte:options customElement="course-prioritizer" />

<script>
  import { onMount } from "svelte";

  let engine = $state(null);
  let currentFileBytes = $state(null);
  let currentStep = $state("loading");
  let loadingText = $state("Loading .NET WebAssembly Engine...");

  let courses = $state([]);
  let selectedCourses = $state([]);
  let beamWidth = $state(3);
  let strictMode = $state(false);
  let engineOutput = $state("");

  onMount(async () => {
    try {
      engine = await window.initializeEngineAsync();

      const urlParams = new URLSearchParams(window.location.search);
      const sharedResult = urlParams.get("result");

      if (sharedResult) {
        const parsedResult = JSON.parse(atob(window.location.search));
        showResults(parsedResult);
      } else {
        currentStep = "upload";
      }
    } catch (err) {
      alert(`Failed to initialize .NET WebAssembly Engine: ${err.message}`);
    }
  });

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

    setTimeout(() => {
      try {
        const result = engine.OEventCourseHelper.Wasm.EngineBridge.Prioritize(
          currentFileBytes,
          beamWidth,
          strictMode,
          selectedCourses,
        );

        if (result.success) {
          const encoded = btoa(JSON.stringify(result));
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

  function showResult(result) {
    if (result.success) {
      engineOutput = JSON.stringify(result, null, 2);
    } else {
      const msgs = result.error.messages;
      engineOutput = `Error [${result.error.type}]:\n${Array.isArray(msgs) ? msgs.join("\n") : msgs}`;
    }
    currentStep = "complete";
  }

  function reset() {
    window.history.pushState({}, "", window.location.pathname);
    currentFileBytes = null;
    currentStep = "upload";
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
  <div
    role="button"
    tabindex="0"
    onclick={() => document.getElementById("xml-upload").click()}
    ondragover={(e) => {
      e.preventDefault();
      e.currentTarget.classList.add("dragover");
    }}
    ondragleave={(e) => e.currentTarget.classList.remove("dragover")}
    ondrop={(e) => {
      e.preventDefault();
      e.currentTarget.classList.remove("dragover");
      if (e.dataTransfer.files.length) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    }}
  >
    <p>
      <strong>Drag & Drop your IOF XML file here</strong> or click to browse
    </p>
    <input
      type="file"
      id="xml-upload"
      accept=".xml"
      style="display: none;"
      onchange={(e) => {
        if (e.target.files.length) {
          handleFileUpload(e.target.files[0]);
        }
      }}
    />
  </div>
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
  <h3>Engine Telemetry Output:</h3>
  <pre class="output-box">{engineOutput}</pre>
  <button class="btn" onclick={reset}>Start Over</button>
{/if}
