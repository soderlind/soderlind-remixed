import { Link } from "@remix-run/react";

export default function SocialLink() {
  return (
    <ul className="social-menu-inner">
      <li className="menu-item-custom menu-social group">
        <a href="https://twitter.com/soderlind">
          <span className="screen-reader-text">Twitter</span>
        </a>
      </li>
      <li className="menu-item-custom menu-social group">
        <a href="https://github.com/soderlind">
          <span className="screen-reader-text">GitHub</span>
        </a>
      </li>
      <li className="menu-item-custom menu-social group">
        <a href="https://www.linkedin.com/in/soderlind/">
          <span className="screen-reader-text">LinkedIn</span>
        </a>
      </li>
    </ul>
  );
}
