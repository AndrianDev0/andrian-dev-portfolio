function WindowBar() {
  return <div className="mock-window-bar"><span className="traffic"><i /><i /><i /></span><span className="address">yourproduct.com</span><span className="window-more">•••</span></div>;
}

export function ServiceVisual({ type }: { type: string }) {
  if (type === "chat") return <div className="service-chat"><div><span>Hi! What are you looking to build?</span></div><p>Telegram bot for sales</p><div><span>Great — let’s map the flow.</span></div><i /><i /><i /></div>;
  if (type === "dashboard") return <div className="service-dashboard"><span><b>12.8k</b><small>ACTIVE USERS</small></span><div className="service-bars"><i /><i /><i /><i /><i /><i /></div><p><i />Live data<em>+18.4%</em></p></div>;
  if (type === "nodes") return <div className="service-nodes"><span>API</span><i /><span>CRM</span><i /><span>BOT</span><i /><span>SALE</span></div>;
  return <div className="service-browser"><WindowBar /><div><span>Clear digital<br />experiences.</span><i /><b>START →</b></div></div>;
}
