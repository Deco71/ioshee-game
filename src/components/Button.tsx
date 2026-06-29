import React from "react";

export enum ButtonVariant {
    MENU_PRIMARY = "menu-primary",
    MENU_SECONDARY = "menu-secondary",
    BACK_HOME = "back-home",
    BACK = "back"
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    description?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant, icon, label, description, className = "", children, ...props }, ref) => {
        // Map variants to default classes
        let variantClasses = "";
        switch (variant) {
            case ButtonVariant.MENU_PRIMARY:
                variantClasses = "menu-btn menu-btn--primary";
                break;
            case ButtonVariant.MENU_SECONDARY:
                variantClasses = "menu-btn menu-btn--secondary";
                break;
            case ButtonVariant.BACK_HOME:
                variantClasses = "back-home-btn";
                break;
            case ButtonVariant.BACK:
                variantClasses = "back-button";
                break;
            default:
                variantClasses = "";
        }

        // Combine default variant classes with custom className
        const combinedClassName = `${variantClasses} ${className}`.trim();

        // Render contents based on variant and children
        const renderContent = () => {
            if (children) {
                return children;
            }

            if (variant === ButtonVariant.MENU_PRIMARY || variant === ButtonVariant.MENU_SECONDARY) {
                return (
                    <>
                        {icon && <span className="menu-btn-icon">{icon}</span>}
                        {label && <span className="menu-btn-label">{label}</span>}
                        {description && <span className="menu-btn-desc">{description}</span>}
                    </>
                );
            }

            return null;
        };

        return (
            <button
                ref={ref}
                className={combinedClassName}
                {...props}
            >
                {renderContent()}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
