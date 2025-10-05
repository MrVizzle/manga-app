import './SaveButton.css';

export default function SaveButton({ 
    onSave, 
    isSaved = false, 
    disabled = false, 
    className = '' 
}) {
 

    return (
        <button 
            className={`save-btn ${isSaved ? 'saved' : ''} ${disabled ? 'disabled' : ''} ${className}`}
            onClick={onSave}
            disabled={disabled}
            aria-label={isSaved ? 'Edit saved manga' : 'Save manga'}
        >
            <svg className="bookmark-icon" viewBox="0 0 24 24" fill="none">
                <path 
                    d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" 
                    fill={isSaved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={isSaved ? 0 : 2}
                />
            </svg>
            {isSaved ? 'Edit' : 'Save'}
        </button>
    );
}