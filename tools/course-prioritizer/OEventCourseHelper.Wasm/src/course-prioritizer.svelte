<script>
  export let engine; // Passed in from main.js
  export let initialData = [];

  async function runCalculation() {
    // Calling the C# Wasm export
    const result = await engine.CalculatePriority(); 
    console.log(result);
  }
</script>

<div class="card">
  <div class="card-body">
    <button class="btn btn-primary" on:click={runCalculation}>
      Update Course Order
    </button>
  </div>
</div>