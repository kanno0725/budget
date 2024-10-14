import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="layout-components footer">
        <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">登録</Link>
          </li>
          <li>
            <Link to="/Graph">履歴</Link>
          </li>
          <li>
            <Link to="/Liquidation">清算</Link>
          </li>
          <li>
            <Link to="/Settings">設定</Link>
          </li>
        </ul>
        </nav>
    </footer>
  );
};

export default Footer;