const Card = ({ children, className = "", style = {} }) => {
    return (
        <div
            className={`premium-card ${className}`}
            style={{
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default Card;
