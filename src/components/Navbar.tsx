import { NavLink } from 'react-router-dom'
import '../css/Navbar.css'

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar__inner">
                <NavLink to="/" className="navbar__brand">
                    האימון שלי
                </NavLink>
                <nav className="navbar__nav" aria-label="Main navigation">
                    <NavLink
                        to="/workout"
                        className={({ isActive }) =>
                            isActive ? "navbar__link navbar__link--active" : "navbar__link"
                        }
                    >
                        האימון שלי
                    </NavLink>

                    <NavLink
                        to="/exercises"
                        className={({ isActive }) =>
                            isActive ? "navbar__link navbar__link--active" : "navbar__link"
                        }
                    >
                        רשימת תרגילים כללית
                    </NavLink>

                    <NavLink
                        to="/programs"
                        className={({ isActive }) =>
                            isActive ? "navbar__link navbar__link--active" : "navbar__link"
                        }
                    >
                        תוכניות מובנות
                    </NavLink>

                    <NavLink
                        to="/tip"
                        className={({ isActive }) =>
                            isActive ? "navbar__link navbar__link--active" : "navbar__link"
                        }
                    >
                        הטיפ השבועי
                    </NavLink>

                    <NavLink
                        to="/auth"
                        className={({ isActive }) =>
                            isActive ? "navbar__link navbar__link--active" : "navbar__link"
                        }
                    >
                        התחבר/הרשם
                    </NavLink>
                </nav>


            </div>
        </header>
    )
}