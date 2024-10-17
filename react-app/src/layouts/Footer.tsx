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
            <Link to="/graph">履歴</Link>
          </li>
          <li>
            <Link to="/liquidation">清算</Link>
          </li>
          <li>
            <Link to="/settings">設定</Link>
          </li>
        </ul>
        </nav>
    </footer>
  );
};

export default Footer;