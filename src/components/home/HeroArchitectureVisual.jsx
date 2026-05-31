import { getConnectionStateClass, getServiceClusterStateClass, getStepStateClass } from "./stepState";

export default function HeroArchitectureVisual({ activeStep, nodes }) {
  const [clientNode, apiNode, coreNode, ...serviceAndDeployNodes] = nodes;
  const serviceNodes = serviceAndDeployNodes.slice(0, 3);
  const deployNode = serviceAndDeployNodes[3];

  return (
    <div className="diagram-grid diagram-grid--hero" role="img" aria-label="Architettura di una soluzione digitale">
      <div className="diagram-row diagram-row--top">
        <div className={`diagram-box hero-node hero-node--${clientNode.id} ${getStepStateClass(0, activeStep)}`}>
          <strong>{clientNode.title}</strong>
          <span>{clientNode.subtitle}</span>
        </div>
        <span
          className={`diagram-connector diagram-connector--horizontal hero-connector hero-connector--client-api ${getConnectionStateClass(1, activeStep)}`}
          aria-hidden="true"
        />
        <div className={`diagram-box hero-node hero-node--${apiNode.id} ${getStepStateClass(1, activeStep)}`}>
          <strong>{apiNode.title}</strong>
          <span>{apiNode.subtitle}</span>
        </div>
      </div>
      <span
        className={`diagram-connector diagram-connector--vertical hero-connector hero-connector--api-core ${getConnectionStateClass(2, activeStep)}`}
        aria-hidden="true"
      />
      <div className={`diagram-box diagram-box--core hero-node hero-node--${coreNode.id} ${getStepStateClass(2, activeStep)}`}>
        <strong>{coreNode.title}</strong>
        <span>{coreNode.subtitle}</span>
      </div>
      <span
        className={`diagram-connector diagram-connector--vertical hero-connector hero-connector--core-services ${getServiceClusterStateClass(activeStep)}`}
        aria-hidden="true"
      />
      <div className={`diagram-services hero-service-cluster ${getServiceClusterStateClass(activeStep)}`}>
        {serviceNodes.map((node, serviceIndex) => {
          const nodeIndex = serviceIndex + 3;

          return (
            <div className={`diagram-box hero-node hero-node--service hero-node--${node.id} ${getStepStateClass(nodeIndex, activeStep)}`} key={node.id}>
              <strong>{node.title}</strong>
              <span>{node.subtitle}</span>
            </div>
          );
        })}
      </div>
      <span
        className={`diagram-connector diagram-connector--vertical hero-connector hero-connector--services-deploy ${getConnectionStateClass(6, activeStep)}`}
        aria-hidden="true"
      />
      <div className={`diagram-box diagram-box--deploy hero-node hero-node--${deployNode.id} ${getStepStateClass(6, activeStep)}`}>
        <strong>{deployNode.title}</strong>
        <span>{deployNode.subtitle}</span>
      </div>
    </div>
  );
}
