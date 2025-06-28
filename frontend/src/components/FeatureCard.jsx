export const FeatureCard = ({ icon, title, info }) => {
    return <div className="feature-card">
        <div className="icon">{icon}</div>
        <h3>{title}</h3>
        <p>{info}</p>
    </div>
}