class AssistanceFigure extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <figure class="assistance-figure">
              <div class="assistance-group" role="group" aria-labelledby="assistance-decisions">
                <div id="assistance-decisions" class="assistance-group-title">1. Supporting user decisions</div>
                <div class="assistance-cards">
                  <div class="assistance-card">
                    <strong class="assistance-card-title">Guidance</strong>
                    <img src="figures/assistance/guidance.webp" width="315" height="185" alt="A toolbox arm indicates a tool for the user." loading="lazy" decoding="async">
                    <span class="assistance-card-example">Suggest the right tool when the user is uncertain.</span>
                  </div>
                  <div class="assistance-card">
                    <strong class="assistance-card-title">Confirmations and corrections</strong>
                    <img src="figures/assistance/confirmation.webp" width="315" height="185" alt="A robotic arm indicates how to rotate a part." loading="lazy" decoding="async">
                    <span class="assistance-card-example">Correct the orientation of a part during assembly.</span>
                  </div>
                </div>
              </div>
              <div class="assistance-group" role="group" aria-labelledby="assistance-workload">
                <div id="assistance-workload" class="assistance-group-title">2. Reducing user workload</div>
                <div class="assistance-cards">
                  <div class="assistance-card">
                    <strong class="assistance-card-title">Anticipatory actions</strong>
                    <img src="figures/assistance/anticipation.webp" width="315" height="185" alt="A robotic arm hands a tool to the user." loading="lazy" decoding="async">
                    <span class="assistance-card-example">Hand over a tool for the next step.</span>
                  </div>
                  <div class="assistance-card">
                    <strong class="assistance-card-title">Secondary assistance</strong>
                    <img src="figures/assistance/secondary.webp" width="315" height="185" alt="A robotic arm clears waste while the user works at the counter." loading="lazy" decoding="async">
                    <span class="assistance-card-example">Clear trash while the user works on the main task.</span>
                  </div>
                  <div class="assistance-card">
                    <strong class="assistance-card-title">Independent task contribution</strong>
                    <img src="figures/assistance/independent.webp" width="315" height="185" alt="A robotic arm assembles part of a dessert beside the user." loading="lazy" decoding="async">
                    <span class="assistance-card-example">Assemble part of the dessert while the user prepares cream.</span>
                  </div>
                </div>
              </div>
            </figure>
        `;
    }
}

customElements.define('assistance-figure', AssistanceFigure);
