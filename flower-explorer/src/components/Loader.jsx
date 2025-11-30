/**
 * Loader.jsx - Loading Spinner Component
 * 
 * This component displays a loading animation while data is being fetched from APIs.
 * 
 * Features:
 * - Animated flower icon (✿) that rotates
 * - Loading text message
 * - Used throughout the app when fetching flower data
 * 
 * Usage:
 * - Shown while API requests are in progress
 * - Prevents users from interacting with empty states
 * - Provides visual feedback that content is loading
 */

import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-container">
      {/* Animated spinning flower icon */}
      <div className="loader">
        <div className="loader-flower">✿</div>
      </div>
      {/* Loading message */}
      <p className="loader-text">Loading specimens...</p>
    </div>
  );
}
