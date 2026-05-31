import { techStackItems } from "../data/about";

export default function TechStack({ items = techStackItems }) {
  return (
    <section className="about-stack reveal">
      <div>
        <h2>Stack Tecnologico</h2>
        <ul className="about-chips">
          {items.map((item, index) => (
            <li className="about-chip reveal" key={item} style={{ "--delay": `${index * 45}ms` }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
