import { Component, type ErrorInfo, type ReactNode } from "react";
export default class NewStyleErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    /* Never log appointment data or error payloads. */
  }
  render() {
    if (this.state.failed)
      return (
        <main className="newstyle ns-content" role="alert">
          <h1>Agenda temporaneamente non disponibile</h1>
          <p>
            Si è verificato un problema durante la visualizzazione. Ricarica la
            pagina per riprovare.
          </p>
          <button onClick={() => window.location.reload()}>
            Ricarica la pagina
          </button>
        </main>
      );
    return this.props.children;
  }
}
