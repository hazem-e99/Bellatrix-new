<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap — Bellatrix Inc.</title>
        <style>
          :root {
            --primary: #C41E3A;
            --primary-light: #dc3545;
            --dark: #0f172a;
            --gray-50: #f8fafc;
            --gray-100: #f1f5f9;
            --gray-200: #e2e8f0;
            --gray-500: #64748b;
            --gray-700: #334155;
            --gray-900: #0f172a;
            --green: #16a34a;
            --blue: #2563eb;
            --orange: #ea580c;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: var(--gray-50);
            color: var(--gray-900);
            line-height: 1.6;
          }
          .header {
            background: linear-gradient(135deg, var(--dark) 0%, #1e293b 100%);
            color: #fff;
            padding: 2.5rem 2rem;
            text-align: center;
          }
          .header h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .header p {
            color: #94a3b8;
            font-size: 0.95rem;
          }
          .header .badge {
            display: inline-block;
            background: var(--primary);
            color: #fff;
            font-size: 0.8rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            margin-top: 0.75rem;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
          }
          .stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
          }
          .stat-card {
            flex: 1;
            min-width: 140px;
            background: #fff;
            border: 1px solid var(--gray-200);
            border-radius: 0.75rem;
            padding: 1rem 1.25rem;
            text-align: center;
          }
          .stat-card .num {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
          }
          .stat-card .label {
            font-size: 0.8rem;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          }
          thead th {
            background: var(--gray-100);
            padding: 0.75rem 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-500);
            text-align: left;
            border-bottom: 1px solid var(--gray-200);
          }
          tbody td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--gray-100);
            font-size: 0.9rem;
          }
          tbody tr:last-child td { border-bottom: none; }
          tbody tr:hover { background: var(--gray-50); }
          td a {
            color: var(--blue);
            text-decoration: none;
            font-weight: 500;
          }
          td a:hover { text-decoration: underline; }
          .priority-high {
            display: inline-block;
            background: #dcfce7;
            color: var(--green);
            font-weight: 600;
            font-size: 0.8rem;
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
          }
          .priority-med {
            display: inline-block;
            background: #fff7ed;
            color: var(--orange);
            font-weight: 600;
            font-size: 0.8rem;
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
          }
          .priority-low {
            display: inline-block;
            background: var(--gray-100);
            color: var(--gray-500);
            font-weight: 600;
            font-size: 0.8rem;
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
          }
          .freq {
            color: var(--gray-500);
            font-size: 0.85rem;
          }
          .footer {
            text-align: center;
            padding: 2rem;
            color: var(--gray-500);
            font-size: 0.8rem;
          }
          @media (max-width: 640px) {
            .header { padding: 1.5rem 1rem; }
            .header h1 { font-size: 1.25rem; }
            .container { padding: 1rem; }
            thead th, tbody td { padding: 0.5rem 0.6rem; font-size: 0.8rem; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🗺️ Bellatrix Inc. — XML Sitemap</h1>
          <p>This sitemap is used by search engines to discover and index all pages on bellatrixinc.com</p>
          <div class="badge">
            <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
          </div>
        </div>

        <div class="container">
          <div class="stats">
            <div class="stat-card">
              <div class="num"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
              <div class="label">Total Pages</div>
            </div>
            <div class="stat-card">
              <div class="num"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority >= 0.8])"/></div>
              <div class="label">High Priority</div>
            </div>
            <div class="stat-card">
              <div class="num"><xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/></div>
              <div class="label">Last Updated</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Priority</th>
                <th>Change Freq</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td style="color: #94a3b8; font-size: 0.8rem;"><xsl:value-of select="position()"/></td>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority >= 0.9">
                        <span class="priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority >= 0.7">
                        <span class="priority-med"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td class="freq"><xsl:value-of select="sitemap:changefreq"/></td>
                  <td style="color: #64748b; font-size: 0.85rem;"><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>

        <div class="footer">
          © 2026 Bellatrix Inc. — Generated automatically on build
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
