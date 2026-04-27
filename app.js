const googleReviewUrl = "https://g.page/r/CRQZCcpudNi1EB0/review";
const reviewWebhookUrl = "https://hooks.zapier.com/hooks/catch/5723286/uv4jq25/";

const paths = {
  improve: "/We%20horen%20graag%20wat%20beter%20kan",
  resolve: "/Het%20spijt%20ons%20dat%20het%20niet%20naar%20wens%20was",
};

const variants = {
  improve: {
    choiceLabel: "Ja/Nee",
    lpSource: "ja-nee",
    title: "We horen graag wat beter kan",
    subtitle: "Help ons verbeteren door uw ervaring te delen.",
    phoneRequired: false,
    messageLabel: "Beschrijf wat we volgens u beter kunnen doen *",
    formAction: reviewWebhookUrl,
  },
  resolve: {
    choiceLabel: "Nee",
    lpSource: "nee",
    title: "Het spijt ons dat het niet naar wens was",
    subtitle: "We nemen dit serieus en willen dit graag samen oplossen.",
    phoneRequired: true,
    messageLabel: "Wat is er fout gelopen en hoe kunnen we dit samen verhelpen? *",
    formAction: reviewWebhookUrl,
  },
};

function normalizedPath() {
  return decodeURIComponent(window.location.pathname)
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

function getVariantFromPath() {
  const path = normalizedPath();

  if (path.includes("het spijt ons")) {
    return variants.resolve;
  }

  if (path.includes("we horen graag")) {
    return variants.improve;
  }

  return null;
}

function renderEntryPage() {
  return `
    <section class="choice-page" aria-labelledby="choice-title">
      <header class="choice-header">
        <img src="/assets/dryguard-logo.png" alt="Dryguard" />
      </header>

      <section class="choice-content">
        <p class="choice-greeting">Beste,</p>
        <h1 id="choice-title">Hoe hebben wij het tot nu toe gedaan?</h1>
        <p class="choice-question">Bent u tevreden over de uitgevoerde werken?</p>

        <nav class="choice-grid" aria-label="Reviewkeuze">
          <a class="choice-card positive" href="${googleReviewUrl}" rel="noopener">
            <span class="face" aria-hidden="true">
              <span class="eye eye-left"></span>
              <span class="eye eye-right"></span>
              <span class="smile"></span>
            </span>
            <span>Ja</span>
          </a>

          <a class="choice-card neutral" href="${paths.improve}">
            <span class="face" aria-hidden="true">
              <span class="eye eye-left"></span>
              <span class="eye eye-right"></span>
              <span class="straight"></span>
            </span>
            <span>Ja/Nee</span>
          </a>

          <a class="choice-card negative" href="${paths.resolve}">
            <span class="face" aria-hidden="true">
              <span class="eye eye-left"></span>
              <span class="eye eye-right"></span>
              <span class="frown"></span>
            </span>
            <span>Nee</span>
          </a>
        </nav>

        <p class="choice-thanks">Bedankt voor je tijd en je vertrouwen.</p>
      </section>
    </section>
  `;
}

function renderFormPage(variant) {
  const phoneRequired = variant.phoneRequired ? "required" : "";
  const phoneLabel = variant.phoneRequired ? "Telefoon *" : "Telefoon";
  const usesWebhook = variant.formAction.startsWith("https://hooks.zapier.com/");
  const formTarget = usesWebhook ? 'target="zapier-submit-frame"' : "";
  const formEnctype = usesWebhook ? 'enctype="multipart/form-data"' : "";

  return `
    <section class="page-shell">
      <img class="brand-logo" src="/assets/dryguard-logo.png" alt="Dryguard" />

      <section class="intro" aria-labelledby="page-title">
        <h1 id="page-title">${variant.title}</h1>
        <p>${variant.subtitle}</p>
      </section>

      <form class="review-form" action="${variant.formAction}" method="post" ${formTarget} ${formEnctype}>
        <input type="hidden" name="choice" value="${variant.choiceLabel}" />
        <input type="hidden" name="lpSource" value="${variant.lpSource}" />
        <input type="hidden" name="pageTitle" value="${variant.title}" />
        <input type="hidden" name="pageUrl" value="${window.location.href}" />

        <div class="field-grid field-grid-primary">
          <label class="field">
            <span>Voornaam *</span>
            <input name="firstName" autocomplete="given-name" placeholder="Voornaam" required />
          </label>

          <label class="field">
            <span>Naam *</span>
            <input name="lastName" autocomplete="family-name" placeholder="Naam" required />
          </label>

          <label class="field">
            <span>Email *</span>
            <input name="email" type="email" autocomplete="email" placeholder="email@voorbeeld.be" required />
          </label>

          <label class="field">
            <span>${phoneLabel}</span>
            <input name="phone" type="tel" autocomplete="tel" placeholder="Uw telefoonnummer" ${phoneRequired} />
          </label>
        </div>

        <div class="field-grid field-grid-secondary">
          <label class="field">
            <span>Offertenummer / factuurnummer</span>
            <input name="reference" placeholder="Offertenummer / factuurnummer" />
          </label>

          <label class="field">
            <span>klantnummer</span>
            <input name="customerNumber" placeholder="klantnummer" />
          </label>
        </div>

        <label class="field field-message">
          <span>${variant.messageLabel}</span>
          <textarea name="message" placeholder="Bericht" required></textarea>
        </label>

        <label class="upload-field">
          <img src="/assets/upload.png" alt="" />
          <span>Foto's uploaden</span>
          <input name="photos" type="file" accept="image/*" multiple />
        </label>

        <button type="submit">Verstuur Bericht</button>
      </form>

      <section class="success-message" role="status" aria-live="polite" hidden>
        <h2>Bedankt voor uw bericht.</h2>
        <p>We hebben uw feedback goed ontvangen en nemen dit verder op.</p>
      </section>

      ${usesWebhook ? '<iframe class="submit-frame" name="zapier-submit-frame" title="Formulierverzending"></iframe>' : ""}
    </section>
  `;
}

function bindFormSubmit() {
  const form = document.querySelector(".review-form");

  if (!form) {
    return;
  }

  const successMessage = document.querySelector(".success-message");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", () => {
    submitButton.disabled = true;
    submitButton.textContent = "Versturen...";

    window.setTimeout(() => {
      form.hidden = true;
      successMessage.hidden = false;
      successMessage.focus?.();
    }, 700);
  });
}

const app = document.querySelector("#app");
const variant = getVariantFromPath();

app.innerHTML = variant ? renderFormPage(variant) : renderEntryPage();
bindFormSubmit();
