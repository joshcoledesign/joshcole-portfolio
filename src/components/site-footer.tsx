"use client";

import { useState } from "react";
import styles from "./site-footer.module.css";

const _u = [99, 111, 108, 101, 116, 104, 105, 114, 116, 101, 101, 110];
const _d = [112, 109, 46, 109, 101];

function assembleAddr() {
  return `${String.fromCharCode(..._u)}@${String.fromCharCode(..._d)}`;
}

export function SiteFooter() {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <footer className={styles.footer}>
      <div className={styles.rule} aria-hidden="true" />
      <div className={styles.row}>
        <section>
          <h2>./contact</h2>
          {email ? (
            <a href={`mailto:${email}`}>{email}</a>
          ) : (
            <span className={styles.inlineItem}>
              email hidden <i>·</i>{" "}
              <button type="button" onClick={() => setEmail(assembleAddr())}>
                [ reveal ]
              </button>
            </span>
          )}
        </section>

        <section>
          <h2>./resume</h2>
          <span className={styles.inlineItem}>
            <a href="/resume" target="_blank" rel="noopener noreferrer">view</a>
            <i>·</i>
            <a href="/resume" target="_blank" rel="noopener noreferrer">print</a>
          </span>
        </section>

        <section className={styles.uplinks}>
          <h2>ls ./uplinks</h2>
          <ul>
            <li><a href="https://www.linkedin.com/in/joshcolecreative/" target="_blank" rel="noopener noreferrer">linkedin</a></li>
            <li><a href="https://www.instagram.com/joshuacolecreative/" target="_blank" rel="noopener noreferrer">instagram</a></li>
            <li>
              <a href="https://github.com/joshcoledesign" target="_blank" rel="noopener noreferrer">github</a>
            </li>
            <li className={styles.muted}>substack&nbsp;&nbsp;writing and thinking, soon</li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
