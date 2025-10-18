import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Plugin information
const PLUGIN_INFO = {
  name: 'TsvWeb Monitor',
  slug: 'tsvweb-monitor',
  version: '1.3.0',
  author: 'TsvWeb',
  homepage: 'https://tsvweb.co.uk',
  download_url: 'https://tsvweb.co.uk/wordpress-plugin/tsvweb-monitor.zip',
  requires: '5.0',
  requires_php: '7.4',
  tested: '6.8.3',
  last_updated: new Date().toISOString(),
  sections: {
    description: 'Sends basic website statistics to TsvWeb dashboard for monitoring',
    changelog: `
      <h4>1.3.0</h4>
      <ul>
        <li>💳 PAYMENT GATEWAY TRACKING! See all payment methods</li>
        <li>💰 Stripe detection & integration</li>
        <li>📊 Last 30 days stats (orders & revenue)</li>
        <li>🎨 Enhanced WooCommerce section with payment badges</li>
        <li>✅ Shows enabled/disabled payment gateways</li>
        <li>🗑️ Removed duplicate Quick Actions</li>
      </ul>
      <h4>1.2.0</h4>
      <ul>
        <li>🛒 WOOCOMMERCE SUPPORT! Track products, orders & sales</li>
        <li>💰 Total Revenue tracking</li>
        <li>📦 Product counts (published & drafts)</li>
        <li>📊 Order statistics (completed & processing)</li>
        <li>🎯 Quick Actions - Force Sync, Check Updates, Open WP Admin, Remove Site</li>
        <li>✨ Removed Request Update & Change Password sections</li>
        <li>🔧 Fixed create-admin 405/500 errors</li>
      </ul>
      <h4>1.1.0</h4>
      <ul>
        <li>🎨 ENHANCED ADMIN UI! Beautiful new sections for all data</li>
        <li>📊 Content Statistics - Comments, Categories, Tags, Media</li>
        <li>💾 Server Resources - Memory, Disk Space, Upload Limits</li>
        <li>🔌 Full Plugin List - See all plugins with versions and authors</li>
        <li>✨ Color-coded cards with icons</li>
        <li>📱 Responsive design</li>
      </ul>
      <h4>1.0.9</h4>
      <ul>
        <li>🔧 FIXED 500 errors in create-admin endpoint</li>
        <li>🔧 Better error handling and logging</li>
        <li>🔧 Improved API key handling</li>
        <li>🔧 More detailed error messages</li>
      </ul>
      <h4>1.0.8</h4>
      <ul>
        <li>✅ AUTO-UPDATES ENABLED! Plugin updates automatically now!</li>
        <li>✅ REST API for remote management - Create admins & reset passwords!</li>
        <li>✅ MORE DATA! Added comments, categories, tags, media, disk space, server info</li>
        <li>✅ EXTENSIVE LOGGING! Track every sync in WordPress error logs</li>
        <li>✅ Full plugin list with versions and authors</li>
        <li>✅ All management buttons now work!</li>
      </ul>
      <h4>1.0.7</h4>
      <ul>
        <li>FORCED 30-second sync on EVERY page load - NO MORE "Never" synced!</li>
        <li>Stats update automatically whenever site is accessed</li>
        <li>Last sync time always shows correctly</li>
      </ul>
      <h4>1.0.6</h4>
      <ul>
        <li>Added automatic plugin updates - no more manual reinstalls!</li>
        <li>Plugin now checks for updates automatically</li>
        <li>One-click update from WordPress dashboard</li>
      </ul>
      <h4>1.0.5</h4>
      <ul>
        <li>Added 30-second auto-sync</li>
        <li>Fixed user role collection</li>
        <li>Improved error handling</li>
      </ul>
    `
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const pluginSlug = searchParams.get('slug');

    // WordPress update check
    if (action === 'plugin_information' && pluginSlug === 'tsvweb-monitor') {
      return NextResponse.json({
        name: PLUGIN_INFO.name,
        slug: PLUGIN_INFO.slug,
        version: PLUGIN_INFO.version,
        author: PLUGIN_INFO.author,
        homepage: PLUGIN_INFO.homepage,
        download_link: PLUGIN_INFO.download_url,
        requires: PLUGIN_INFO.requires,
        requires_php: PLUGIN_INFO.requires_php,
        tested: PLUGIN_INFO.tested,
        last_updated: PLUGIN_INFO.last_updated,
        sections: PLUGIN_INFO.sections,
        banners: {
          low: 'https://tsvweb.co.uk/TsvWeb_Logo_DarkTheme.png',
          high: 'https://tsvweb.co.uk/TsvWeb_Logo_DarkTheme.png'
        }
      });
    }

    // Version check
    return NextResponse.json({
      slug: PLUGIN_INFO.slug,
      version: PLUGIN_INFO.version,
      url: PLUGIN_INFO.homepage,
      package: PLUGIN_INFO.download_url,
      tested: PLUGIN_INFO.tested,
      requires_php: PLUGIN_INFO.requires_php,
      requires: PLUGIN_INFO.requires
    });

  } catch (error) {
    console.error('Error in plugin update endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // WordPress sends plugin data for update check
    if (body.plugins && body.plugins['tsvweb-monitor/tsvweb-monitor.php']) {
      const installedVersion = body.plugins['tsvweb-monitor/tsvweb-monitor.php'];
      
      // Check if update is available
      if (installedVersion !== PLUGIN_INFO.version) {
        return NextResponse.json({
          'tsvweb-monitor/tsvweb-monitor.php': {
            slug: PLUGIN_INFO.slug,
            plugin: 'tsvweb-monitor/tsvweb-monitor.php',
            new_version: PLUGIN_INFO.version,
            url: PLUGIN_INFO.homepage,
            package: PLUGIN_INFO.download_url,
            tested: PLUGIN_INFO.tested,
            requires_php: PLUGIN_INFO.requires_php,
            requires: PLUGIN_INFO.requires
          }
        });
      }
    }

    return NextResponse.json({});

  } catch (error) {
    console.error('Error in plugin update check:', error);
    return NextResponse.json({});
  }
}
