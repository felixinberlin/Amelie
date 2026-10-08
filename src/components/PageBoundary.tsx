import React, { Suspense } from 'react';

export class PageBoundary extends React.Component<React.PropsWithChildren<{ resetKey: string }>, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidUpdate(previous: Readonly<React.PropsWithChildren<{ resetKey: string }>>) {
    if (previous.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: false });
  }
  render() {
    if (this.state.error) return <div role="alert" className="p-8 space-y-4">
      <p>This page could not load. Your saved local data is still available.</p>
      <button className="underline" onClick={() => window.location.reload()}>Reload and retry</button>
    </div>;
    return <Suspense fallback={<p role="status" className="p-8">Loading…</p>}>{this.props.children}</Suspense>;
  }
}
