(() => {
  const config = window.SHREI_ADS_CONFIG || {};
  const publisherIdPattern = /^ca-pub-\d+$/;
  const slotIdPattern = /^\d+$/;
  let adsenseScript;

  function configuredSlot(placement) {
    const slotId = config.slots?.[placement];
    return config.enabled === true
      && publisherIdPattern.test(config.publisherId || "")
      && slotIdPattern.test(slotId || "")
      ? slotId
      : "";
  }

  function loadAdsense() {
    if (adsenseScript) return adsenseScript;
    adsenseScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.publisherId)}`;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Google AdSense failed to load."));
      document.head.appendChild(script);
    });
    return adsenseScript;
  }

  function clearSlot(slot) {
    if (slot.dataset.adInitialized !== "true") return;
    slot.replaceChildren();
    delete slot.dataset.adInitialized;
  }

  function renderForView(view) {
    document.querySelectorAll("[data-ad-placement]").forEach((slot) => {
      const placement = slot.dataset.adPlacement;
      const slotId = ["home", "browse"].includes(view) ? configuredSlot(placement) : "";
      if (!slotId) {
        clearSlot(slot);
        slot.hidden = true;
        return;
      }
      if (slot.dataset.adInitialized === "true") {
        slot.hidden = false;
        return;
      }

      slot.innerHTML = `<span class="ad-label">Advertisement</span><ins class="adsbygoogle" data-ad-client="${config.publisherId}" data-ad-slot="${slotId}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
      slot.dataset.adInitialized = "true";
      slot.hidden = false;

      loadAdsense().then(() => {
        if (slot.hidden || slot.dataset.adInitialized !== "true") return;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }).catch((error) => {
        console.error("Could not load the configured advertisement:", error);
        clearSlot(slot);
        slot.hidden = true;
      });
    });
  }

  window.SHREIAds = Object.freeze({ renderForView });
})();
