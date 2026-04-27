import { View, Text, Pressable, Image, StyleSheet, Platform } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react-native';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* Logo */}
        <Link href="/" asChild>
          <Pressable style={styles.logoContainer}>
            <Image
              source={require('../../../assets/puzzleedge_logo3.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>
        </Link>

        {/* Desktop Navigation */}
        <View style={styles.desktopNav}>
          <Link href="/" asChild>
            <Pressable style={styles.navLink}>
              <Text style={[styles.navLinkText, isActive('/') && styles.navLinkActive]}>
                Home
              </Text>
            </Pressable>
          </Link>

          <Link href="/games/queens" asChild>
            <Pressable style={styles.navLink}>
              <Text style={[styles.navLinkText, isActive('/games/queens') && styles.navLinkActive]}>
                Queens Game
              </Text>
            </Pressable>
          </Link>

          <Link href="/how-to-play/queens" asChild>
            <Pressable style={styles.navLink}>
              <Text style={[styles.navLinkText, isActive('/how-to-play') && styles.navLinkActive]}>
                How to Play
              </Text>
            </Pressable>
          </Link>

          <Link href="/articles" asChild>
            <Pressable style={styles.navLink}>
              <Text style={[styles.navLinkText, isActive('/articles') && styles.navLinkActive]}>
                Articles
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Mobile Menu Button */}
        <Pressable
          style={styles.mobileMenuButton}
          onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} color="#F0F0F8" />
          ) : (
            <Menu size={24} color="#F0F0F8" />
          )}
        </Pressable>
      </View>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <View style={styles.mobileMenu}>
          <Link href="/" asChild>
            <Pressable
              style={styles.mobileNavLink}
              onPress={() => setMobileMenuOpen(false)}
            >
              <Text style={[styles.mobileNavLinkText, isActive('/') && styles.mobileNavLinkActive]}>
                Home
              </Text>
            </Pressable>
          </Link>

          <Link href="/games/queens" asChild>
            <Pressable
              style={styles.mobileNavLink}
              onPress={() => setMobileMenuOpen(false)}
            >
              <Text style={[styles.mobileNavLinkText, isActive('/games/queens') && styles.mobileNavLinkActive]}>
                Queens Game
              </Text>
            </Pressable>
          </Link>

          <Link href="/how-to-play/queens" asChild>
            <Pressable
              style={styles.mobileNavLink}
              onPress={() => setMobileMenuOpen(false)}
            >
              <Text style={[styles.mobileNavLinkText, isActive('/how-to-play') && styles.mobileNavLinkActive]}>
                How to Play
              </Text>
            </Pressable>
          </Link>

          <Link href="/articles" asChild>
            <Pressable
              style={styles.mobileNavLink}
              onPress={() => setMobileMenuOpen(false)}
            >
              <Text style={[styles.mobileNavLinkText, isActive('/articles') && styles.mobileNavLinkActive]}>
                Articles
              </Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0A0A0F',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3D',
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        zIndex: 1000,
      },
    }),
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 36,
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        '@media (max-width: 768px)': {
          display: 'none',
        },
      },
      default: {
        display: 'none',
      },
    }),
  },
  navLink: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  navLinkText: {
    color: '#8888AA',
    fontSize: 15,
    fontWeight: '500',
  },
  navLinkActive: {
    color: '#4F6EF7',
  },
  mobileMenuButton: {
    padding: 8,
    ...Platform.select({
      web: {
        '@media (min-width: 769px)': {
          display: 'none',
        },
      },
      default: {
        display: 'flex',
      },
    }),
  },
  mobileMenu: {
    backgroundColor: '#13131A',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3D',
    paddingVertical: 8,
  },
  mobileNavLink: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C27',
  },
  mobileNavLinkText: {
    color: '#8888AA',
    fontSize: 16,
    fontWeight: '500',
  },
  mobileNavLinkActive: {
    color: '#4F6EF7',
  },
});
