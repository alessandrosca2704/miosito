export default function TechStack() {
  const items = [
    "React", "Angular", "Tailwind/CSS", "Node.js (Express)", "Firebase", "HTML5", "Java", "JavaScript", "C/C++",
    "PostgreSQL/MongoDB", "ESP32", "MQTT", "ThingsBoard", "Grafana"
  ];
  return (
    <section className="about-stack reveal delay-3">
      <div className="container">
        <h2>Stack Tecnologico</h2>
        <ul className="about-chips">
          {items.map((x,i) => <li className="about-chip reveal" key={x} style={{animationDelay:`${0.9+i * 0.2}s`}}>{x} </li>)}
        </ul>
      </div>
    </section>
  );
}
