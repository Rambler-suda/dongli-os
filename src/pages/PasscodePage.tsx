import { useState, type FormEvent } from "react";
import { useAppStore } from "../store/appStore";

const PASSCODE = "0607";

export function PasscodePage() {
  const unlockApp = useAppStore((state) => state.unlockApp);
  const [passcode, setPasscode] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passcode !== PASSCODE) {
      setHasError(true);
      return;
    }

    unlockApp();
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-content onboarding-content--centered">
        <div className="onboarding-mark" aria-hidden="true">
          <span />
          <span />
        </div>

        <div className="onboarding-heading">
          <p className="eyebrow">DL universe</p>
          <h1>进入冻梨 OS</h1>
          <p>猜猜暗号是什么</p>
        </div>

        <form className="onboarding-card passcode-card" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="passcode">
            我们的暗号
          </label>
          <input
            id="passcode"
            className="passcode-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            pattern="[0-9]*"
            placeholder="••••"
            aria-invalid={hasError}
            aria-describedby={hasError ? "passcode-error" : undefined}
            value={passcode}
            onChange={(event) => {
              setPasscode(event.target.value.replace(/\D/g, "").slice(0, 4));
              setHasError(false);
            }}
          />
          <p
            className="field-message"
            data-visible={hasError}
            id="passcode-error"
            role={hasError ? "alert" : undefined}
          >
            暗号好像不对，再想想。
          </p>
          <button className="primary-button" type="submit" disabled={passcode.length !== 4}>
            进入小世界
          </button>
        </form>

        <p className="onboarding-footnote">只在第一次见面时问你</p>
      </section>
    </main>
  );
}
