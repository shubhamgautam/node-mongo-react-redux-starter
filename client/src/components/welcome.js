import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    {/* Main jumbotron for a primary marketing message or call to action */}
    <div className="jumbotron">
      <h1 className="display-3">Welcome!</h1>
      <p>
        <Link className="btn btn-primary btn-lg" to="/posts" role="button">
          Look the blog posts &raquo;
        </Link>
      </p>
    </div>
  </div>
);
