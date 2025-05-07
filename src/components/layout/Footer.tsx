import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Newspaper.AI</h3>
            <p className="text-sm text-muted-foreground">
              Your AI-powered news aggregator that delivers personalized content with speed and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/feed" className="text-sm text-muted-foreground hover:text-primary">
                  News Feed
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-muted-foreground hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-sm text-muted-foreground hover:text-primary">
                  Saved Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Newspaper.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 