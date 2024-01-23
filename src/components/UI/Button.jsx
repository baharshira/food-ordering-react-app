
// This component generalizes a button, using the passed props
// The children props shows the content inside nested components
export default function Button({ children, textOnly, className, ...props }) {
    const cssClasses = textOnly ? `text-button ${className}` : 'button';
    return(
        <button className={cssClasses} {...props}>
            {children}
        </button>
    );
}