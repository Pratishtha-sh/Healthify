const Card = ({ children, className = "", style = {}, onClick }) => {
    return (
        <div
            className={`premium-card ${className}`}
            style={{ ...style }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
