"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, Leaf, Menu, Newspaper, Shield, Sun, X, Zap } from "lucide-react";

type EventItem = { id: number; title: string; description: string; location: string; startsAt: string; status: string };
const sampleEvents: EventItem[] = [
  { id: -1, title: "Community listening session", description: "Share questions and concerns with neighbors. Sample listing — details to be confirmed.", location: "La Grange, TX · Venue TBA", startsAt: "2026-10-22T18:00:00-05:00", status: "sample" },
  { id: -2, title: "Fayette County public meeting watch", description: "Gather to follow the public agenda and take notes together. Sample listing.", location: "Fayette County · Details TBA", startsAt: "2026-11-05T17:30:00-06:00", status: "sample" },
];
const news = [
  { tag: "Community guide", date: "Start here", title: "What to ask about a proposed data center", text: "A practical checklist covering water, electricity, noise, traffic, tax incentives, and emergency planning." },
  { tag: "Project tracker", date: "Living document", title: "Follow the proposal from application to decision", text: "Use the project page to organize source documents, public meetings, permits, and unanswered questions." },
  { tag: "Get involved", date: "Community resource", title: "How to make public comment count", text: "Prepare a short, specific statement, cite the record, and request a clear response from decision-makers." },
];

function fmtDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)); }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>(sampleEvents);
  const [filter, setFilter] = useState("all");
  useEffect(() => { fetch("/api/events").then((r) => r.ok ? r.json() : []).then((rows) => rows.length && setEvents(rows)).catch(() => {}); }, []);
  const visibleEvents = useMemo(() => filter === "all" ? events : events.filter((e) => e.status === filter), [events, filter]);

  return <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Protect Fayette County home"><span className="brand-mark"><b>★</b></span><span>Protect <strong>Fayette County</strong></span></a>
      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
        <a href="/stories">Our stories</a><a href="#project" onClick={()=>setMenuOpen(false)}>The project</a><a href="#events" onClick={()=>setMenuOpen(false)}>Events</a><a href="#news" onClick={()=>setMenuOpen(false)}>News</a><a href="#action" onClick={()=>setMenuOpen(false)}>Take action</a><a className="admin-link" href="/admin">Admin</a>
      </nav>
      <button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <section id="top" className="hero"><div className="hero-content">
      <p className="eyebrow"><span/> La Grange · Fayette County · Texas</p><h1>Our land.<br/><em>Our water.</em><br/>Our say.</h1>
      <p className="hero-copy">Ranch families, neighbors, and stewards of this land deserve a clear voice in what comes next. Follow the proposed data center and help protect the working countryside we call home.</p>
      <div className="hero-actions"><a className="button primary" href="#project">Understand the project <ArrowRight size={18}/></a><a className="button ghost" href="#events">See community events</a></div>
      <p className="source-note">Community advocacy site · Verify dates and official actions with the relevant public agency.</p>
    </div><div className="hero-art"><Image className="hero-image" src="/ranch-sunset-original.jpg" alt="A Fayette County pasture and ranch barn beneath a dramatic amber sunset" fill priority sizes="(max-width: 900px) 100vw, 50vw"/><div className="art-caption"><span>What happens when an industrial-scale neighbor meets ranch country?</span><a href="#project">Explore the questions <ChevronRight size={16}/></a></div></div></section>

    <section className="quick-strip" aria-label="Key topics"><span>What neighbors are asking</span><div><Zap size={18}/> Grid demand</div><div><Sun size={18}/> Water use</div><div><Shield size={18}/> Noise &amp; safety</div><div><Leaf size={18}/> Land &amp; heritage</div></section>

    <section className="heritage-band"><div className="heritage-brand"><span>★</span><small>ROOTED IN</small><strong>FAYETTE COUNTY</strong></div><div className="stake-content"><p className="eyebrow dark"><span/> What is at stake</p><h2>The stakes are measured<br/>in generations—not megawatts.</h2><p className="stake-lead">Working ranches, dark skies, creek bottoms, and pine country are not empty space waiting to be used. They are livelihoods, family histories, wildlife habitat, and the inheritance we leave behind.</p><p>Industrial-scale development can change a rural landscape long after construction crews leave. Before lasting decisions are made, Fayette County families deserve public notice, independent answers about water and power demand, and enforceable protections for noise, light, traffic, drainage, emergency response, and neighboring property.</p><div className="contact-panel"><div className="contact-intro"><small>Make your voice part of the record</small><h3>Ask local leaders for a transparent process.</h3><p>Be respectful, identify yourself as a Fayette County resident or landowner, and ask that project information and opportunities for public input be shared before commitments are made.</p></div><div className="officials-grid"><article><small>Texas House · District 85</small><strong>Rep. Stan Kitzman</strong><a href="tel:+15124630604">(512) 463-0604</a><a href="https://house.texas.gov/members/4280" target="_blank" rel="noreferrer">Official contact page ↗</a></article><article><small>Fayette County Judge</small><strong>Dan Mueller</strong><a href="tel:+19799686469">(979) 968-6469</a></article><article><small>Commissioner · Precinct 1</small><strong>Jason McBroom</strong><a href="tel:+19799683358">(979) 968-3358</a></article><article><small>Commissioner · Precinct 2</small><strong>Clint Sternadel</strong><a href="tel:+19792493166">(979) 249-3166</a></article><article><small>Commissioner · Precinct 3</small><strong>Harvey Berckenhoff</strong><a href="tel:+13618653524">(361) 865-3524</a></article><article><small>Commissioner · Precinct 4</small><strong>Drew Brossmann</strong><a href="tel:+19797433250">(979) 743-3250</a></article></div><a className="official-source" href="https://www.co.fayette.tx.us/page/fayette.Commissioners.Court" target="_blank" rel="noreferrer">Official Fayette County Commissioners Court directory ↗</a></div></div></section>

    <section id="project" className="section project-section"><div className="section-heading"><p className="eyebrow dark"><span/> The proposal</p><h2>A big project deserves<br/>clear answers.</h2></div><div className="project-grid"><article className="project-intro"><p className="lead">Data centers can bring investment, but they can also place major new demands on rural infrastructure. Our goal is simple: put reliable information in residents’ hands before lasting decisions are made.</p><p>This page is a framework for the organizer to publish sourced project facts, permit documents, developer statements, and public records as they become available.</p><a className="text-link" href="#action">Help build the public record <ArrowRight size={17}/></a></article><div className="question-grid">
      <article><span>01</span><Zap/><h3>Power &amp; grid</h3><p>What load is requested? Who funds transmission upgrades, and how will reliability be protected?</p></article><article><span>02</span><Sun/><h3>Water &amp; drought</h3><p>What cooling system is planned, what is peak consumption, and which water source would supply it?</p></article><article><span>03</span><Shield/><h3>Noise &amp; safety</h3><p>How will generator testing, cooling equipment, lighting, battery storage, and emergencies be managed?</p></article><article><span>04</span><Leaf/><h3>Land &amp; roads</h3><p>What changes are expected for drainage, traffic, views, wildlife habitat, and neighboring ranch operations?</p></article>
    </div></div></section>

    <section className="timeline-section"><div className="section-heading light"><p className="eyebrow"><span/> Follow the process</p><h2>From proposal to public decision</h2></div><div className="timeline">{[["1","Proposal identified","Collect site plans, ownership records, and developer materials."],["2","Agency review","Track permits, utility requests, incentives, and environmental review."],["3","Public input","Publish meeting dates, comment windows, and source documents."],["4","Decision & oversight","Record votes, conditions, construction milestones, and compliance."]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div></section>

    <section id="events" className="section events-section"><div className="section-heading row"><div><p className="eyebrow dark"><span/> Show up</p><h2>Community calendar</h2></div><div className="filter" aria-label="Filter events"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>All</button><button className={filter==='published'?'active':''} onClick={()=>setFilter('published')}>Confirmed</button></div></div><div className="events-list">{visibleEvents.map((event)=><article className="event-card" key={event.id}><time><strong>{new Date(event.startsAt).toLocaleDateString('en-US',{day:'2-digit'})}</strong><span>{new Date(event.startsAt).toLocaleDateString('en-US',{month:'short'})}</span></time><div className="event-info"><div className="event-meta"><span>{event.status==='sample'?'Sample listing':event.status}</span> {fmtDate(event.startsAt)}</div><h3>{event.title}</h3><p>{event.description}</p><small>{event.location}</small></div><a href={event.id<0?'#action':'/admin'} aria-label={`View ${event.title}`}><ArrowRight/></a></article>)}</div></section>

    <section id="news" className="section news-section"><div className="section-heading row"><div><p className="eyebrow dark"><span/> Stay informed</p><h2>News &amp; resources</h2></div><Newspaper size={44}/></div><div className="news-grid">{news.map((item,i)=><article className={i===0?'featured':''} key={item.title}><div className="news-top"><span>{item.tag}</span><small>{item.date}</small></div><h3>{item.title}</h3><p>{item.text}</p><a href="#action">Read the guide <ArrowRight size={16}/></a></article>)}</div></section>

    <section id="action" className="action-section"><div><p className="eyebrow"><span/> Stand with your neighbors</p><h2>Keep Fayette County<br/>in community hands.</h2></div><div className="action-card"><h3>Join the local update list</h3><p>Email the organizing team to receive meeting notices, new documents, and clear ways to participate.</p><a className="button light-button" href="mailto:faycofriends@gmail.com?subject=Protect%20Fayette%20County%20updates">Email faycofriends@gmail.com <ArrowRight size={18}/></a><small>An online sign-up form will be linked here when available.</small></div></section>
    <footer><div className="brand"><span className="brand-mark"><b>★</b></span><span>Protect <strong>Fayette County</strong></span></div><p>For ranch families, neighbors, and a transparent public process.</p><div><a href="/stories">Stories</a><a href="#project">Project</a><a href="#events">Events</a><a href="#news">News</a><a href="/admin">Admin</a></div></footer>
  </main>;
}
