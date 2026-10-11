import { requireAdmin } from "../../lib/auth";
import { listEvents } from "../../lib/events";
import AdminEvents from "./admin-events";
export const dynamic="force-dynamic";
export default async function AdminPage(){await requireAdmin();const rows=await listEvents(false);return <main className="admin-shell"><header className="admin-header"><a href="/" className="brand"><span className="brand-mark">FC</span><span>Protect <strong>Fayette County</strong></span></a><div><span>Administrator</span><form action="/api/admin/logout" method="post"><button className="signout-button">Sign out</button></form></div></header><section className="admin-main"><div className="admin-title"><div><p className="eyebrow dark"><span/> Organizer tools</p><h1>Events dashboard</h1><p>Create, edit, publish, and track community events.</p></div><a className="back-link" href="/">← View website</a></div><AdminEvents initialEvents={rows}/></section></main>}
