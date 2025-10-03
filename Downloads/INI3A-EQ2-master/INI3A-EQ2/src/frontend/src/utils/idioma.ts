import { useEffect } from 'react';

function idioma() {
  useEffect(() => {
    const idiomaSalvo = localStorage.getItem('idiomaGoogle');
    if (idiomaSalvo) {
      document.documentElement.lang = idiomaSalvo;
      console.log(`[Google Translate] Forçando lang no html: ${idiomaSalvo}`);
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'lang') {
          const lang = document.documentElement.lang;
          localStorage.setItem('idiomaGoogle', lang);
          console.log(`[Google Translate] Idioma detectado e salvo: ${lang}`);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    const reaplicarIdioma = () => {
      if (!idiomaSalvo) return;

      const waitForIframe = setInterval(() => {
        const frame = document.querySelector('iframe.goog-te-menu-frame');
        if (frame) {
          clearInterval(waitForIframe);

          const tryClickLang = setInterval(() => {
            try {
              const innerDoc = frame.contentDocument || frame.contentWindow.document;
              const langButton = innerDoc.querySelector(`[lang="${idiomaSalvo}"]`);
              if (langButton) {
                langButton.click();
                console.log(`[Google Translate] Idioma reaplicado: ${idiomaSalvo}`);
                clearInterval(tryClickLang);
              }
            } catch (e) {
            }
          }, 500);

          setTimeout(() => clearInterval(tryClickLang), 10000);
        }
      }, 500);

      setTimeout(() => clearInterval(waitForIframe), 15000);
    };

    const timer = setTimeout(() => {
      reaplicarIdioma();
    }, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);
}

export default idioma;
