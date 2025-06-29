import React from "react";

const navbarItems = [
    { name: "Home", link: "#" },
    { name: "About", link: "#about" },
    { name: "signin", link: "/sign-in" },
    { name: "signup", link: "/sign-up" },
];

const navbarConfig = {
    brand: "CodeHub",
    items: navbarItems,
};

const Navbar: React.FC = () => {
    return (
        <nav
            style={{
                background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
                padding: "0.75rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <div
                style={{
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    color: "#fff",
                    letterSpacing: "2px",
                }}
            >
                {navbarConfig.brand}
            </div>
            <ul
                style={{
                    display: "flex",
                    gap: "2rem",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                }}
            >
                {navbarConfig.items.map((item) => (
                    <li key={item.name}>
                        <a
                            href={item.link}
                            style={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "1.1rem",
                                transition: "color 0.2s",
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = "#ffd700")}
                            onMouseOut={e => (e.currentTarget.style.color = "#fff")}
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;

// Object with list of components used in the navbar
export const navbarComponents = {
    Navbar,
    navbarConfig,
};