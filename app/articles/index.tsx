import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';
import { BookOpen, Target, AlertCircle, Calendar, Lightbulb } from 'lucide-react-native';

const queensArticles = [
  {
    id: 'queens-beginners-guide',
    title: 'Ultimate Beginner\'s Guide to LinkedIn Queens Puzzle',
    description: 'Everything you need to know to start solving Queens puzzles like a pro. Perfect for complete beginners.',
    icon: BookOpen,
    readTime: '10 min read',
    href: '/articles/beginners-guide',
  },
  {
    id: 'queens-rules-explained',
    title: 'Queens Puzzle Rules Explained with Visual Examples',
    description: 'A comprehensive breakdown of all Queens puzzle rules with step-by-step visual examples.',
    icon: Lightbulb,
    readTime: '7 min read',
    href: '/articles/rules-explained',
  },
  {
    id: 'queens-advanced-strategies',
    title: '10 Advanced Queens Puzzle Strategies from Experts',
    description: 'Take your Queens puzzle skills to the next level with these expert techniques and advanced solving strategies.',
    icon: Target,
    readTime: '8 min read',
    href: '/articles/advanced-strategies',
  },
  {
    id: 'queens-common-mistakes',
    title: 'Common Queens Puzzle Mistakes and How to Fix Them',
    description: 'Avoid these frequent errors that trip up Queens puzzle solvers and learn how to correct them quickly.',
    icon: AlertCircle,
    readTime: '6 min read',
    href: '/articles/common-mistakes',
  },
  {
    id: 'queens-daily-practice-tips',
    title: 'Master LinkedIn Queens: Daily Practice Tips',
    description: 'Build a consistent practice routine to improve your Queens puzzle solving speed and accuracy.',
    icon: Calendar,
    readTime: '5 min read',
    href: '/articles/daily-practice-tips',
  },
];

const tangoArticles = [
  {
    id: 'tango-beginners-guide',
    title: 'Ultimate Beginner\'s Guide to LinkedIn Tango Puzzle',
    description: 'Everything you need to know to start solving Tango puzzles. Master binary logic from scratch.',
    icon: BookOpen,
    readTime: '12 min read',
    href: '/articles/tango-beginners-guide',
  },
  {
    id: 'tango-rules-explained',
    title: 'Tango Puzzle Rules Explained with Visual Examples',
    description: 'A comprehensive breakdown of all 5 Tango rules with clear examples and common violations.',
    icon: Lightbulb,
    readTime: '9 min read',
    href: '/articles/tango-rules-explained',
  },
  {
    id: 'tango-advanced-strategies',
    title: '10 Advanced Tango Puzzle Strategies from Experts',
    description: 'Master constraint chains, intersection forcing, and advanced pattern recognition techniques.',
    icon: Target,
    readTime: '11 min read',
    href: '/articles/tango-advanced-strategies',
  },
  {
    id: 'tango-common-mistakes',
    title: 'Common Tango Puzzle Mistakes and How to Fix Them',
    description: 'Avoid the 7 most common Tango errors and learn the systematic fixes that expert solvers use.',
    icon: AlertCircle,
    readTime: '8 min read',
    href: '/articles/tango-common-mistakes',
  },
  {
    id: 'tango-daily-practice-tips',
    title: 'Master LinkedIn Tango: Daily Practice Tips',
    description: 'Build a consistent practice routine to improve your Tango solving speed and accuracy.',
    icon: Calendar,
    readTime: '6 min read',
    href: '/articles/tango-daily-practice-tips',
  },
];

const zipArticles = [
  {
    id: 'zip-beginners-guide',
    title: 'Ultimate Beginner\'s Guide to LinkedIn Zip Puzzle',
    description: 'Learn how to solve Zip path-finding puzzles from scratch. Complete tutorial with examples.',
    icon: BookOpen,
    readTime: '12 min read',
    href: '/articles/zip-beginners-guide',
  },
  {
    id: 'zip-rules-explained',
    title: 'Zip Puzzle Rules Explained with Visual Examples',
    description: 'Master all 5 essential rules of Zip puzzles with clear explanations and practical examples.',
    icon: Lightbulb,
    readTime: '10 min read',
    href: '/articles/zip-rules-explained',
  },
  {
    id: 'zip-advanced-strategies',
    title: '10 Advanced Zip Puzzle Strategies from Experts',
    description: 'Master forced path analysis, cell budgeting, and advanced path-finding techniques.',
    icon: Target,
    readTime: '11 min read',
    href: '/articles/zip-advanced-strategies',
  },
  {
    id: 'zip-common-mistakes',
    title: 'Common Zip Puzzle Mistakes and How to Fix Them',
    description: 'Avoid the 7 most common Zip errors that trap beginners and learn systematic fixes.',
    icon: AlertCircle,
    readTime: '9 min read',
    href: '/articles/zip-common-mistakes',
  },
  {
    id: 'zip-daily-practice-tips',
    title: 'Master LinkedIn Zip: Daily Practice Tips',
    description: 'Build a consistent practice routine to improve your path-finding speed and accuracy.',
    icon: Calendar,
    readTime: '7 min read',
    href: '/articles/zip-daily-practice-tips',
  },
];

export default function ArticlesIndexPage() {
  return (
    <>
      <SEO
        title="LinkedIn Puzzle Articles & Guides - Queens, Tango, Zip Strategy"
        description="Expert guides, strategies, and tips for mastering LinkedIn puzzles. Comprehensive articles covering Queens, Tango, and Zip puzzles from beginner basics to advanced techniques."
        keywords={[
          'LinkedIn puzzle articles',
          'Queens puzzle guide',
          'Tango puzzle guide',
          'Zip puzzle guide',
          'LinkedIn puzzle strategy',
          'puzzle solving tips',
          'LinkedIn puzzle tutorials',
          'puzzle game guides',
          'LinkedIn puzzle help',
          'puzzle solving techniques'
        ]}
        canonicalUrl="https://puzzleedge.app/articles"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>LinkedIn Puzzle Articles & Guides</Text>
            <Text style={styles.subtitle}>
              Expert insights, strategies, and tips to master Queens, Tango, and Zip puzzles
            </Text>
          </View>

          {/* Queens Articles */}
          <View style={styles.gameSection}>
            <Text style={styles.gameTitle}>Queens Puzzle Articles</Text>
            <Text style={styles.gameDescription}>
              Master the classic N-Queens placement puzzle with expert strategies and comprehensive guides
            </Text>
            <View style={styles.articleGrid}>
              {queensArticles.map((article) => {
                const Icon = article.icon;
                return (
                  <Link key={article.id} href={article.href} asChild>
                    <Pressable style={styles.articleCard}>
                      <View style={styles.iconContainer}>
                        <Icon size={28} color="#4F6EF7" />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{article.title}</Text>
                        <Text style={styles.cardDescription}>{article.description}</Text>
                        <Text style={styles.readTime}>{article.readTime}</Text>
                      </View>
                      <Text style={styles.arrow}>→</Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </View>

          {/* Tango Articles */}
          <View style={styles.gameSection}>
            <Text style={styles.gameTitle}>Tango Puzzle Articles</Text>
            <Text style={styles.gameDescription}>
              Master binary logic puzzles with constraint-based solving techniques and pattern recognition
            </Text>
            <View style={styles.articleGrid}>
              {tangoArticles.map((article) => {
                const Icon = article.icon;
                return (
                  <Link key={article.id} href={article.href} asChild>
                    <Pressable style={styles.articleCard}>
                      <View style={styles.iconContainer}>
                        <Icon size={28} color="#4F6EF7" />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{article.title}</Text>
                        <Text style={styles.cardDescription}>{article.description}</Text>
                        <Text style={styles.readTime}>{article.readTime}</Text>
                      </View>
                      <Text style={styles.arrow}>→</Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </View>

          {/* Zip Articles */}
          <View style={styles.gameSection}>
            <Text style={styles.gameTitle}>Zip Puzzle Articles</Text>
            <Text style={styles.gameDescription}>
              Master Hamiltonian path-finding puzzles with advanced route planning and spatial reasoning
            </Text>
            <View style={styles.articleGrid}>
              {zipArticles.map((article) => {
                const Icon = article.icon;
                return (
                  <Link key={article.id} href={article.href} asChild>
                    <Pressable style={styles.articleCard}>
                      <View style={styles.iconContainer}>
                        <Icon size={28} color="#4F6EF7" />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{article.title}</Text>
                        <Text style={styles.cardDescription}>{article.description}</Text>
                        <Text style={styles.readTime}>{article.readTime}</Text>
                      </View>
                      <Text style={styles.arrow}>→</Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Practice?</Text>
            <Text style={styles.ctaDescription}>
              Put your knowledge to the test with thousands of practice puzzles across all three games
            </Text>
            <View style={styles.ctaButtons}>
              <Link href="/games/queens/practice" asChild>
                <Pressable style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Practice Queens</Text>
                </Pressable>
              </Link>
              <Link href="/games/tango/practice" asChild>
                <Pressable style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Practice Tango</Text>
                </Pressable>
              </Link>
              <Link href="/games/zip/practice" asChild>
                <Pressable style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Practice Zip</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    padding: 32,
    paddingBottom: 64,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 64,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#8888AA',
    textAlign: 'center',
    maxWidth: 700,
    alignSelf: 'center',
  },
  gameSection: {
    marginBottom: 64,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 12,
  },
  gameDescription: {
    fontSize: 16,
    color: '#8888AA',
    marginBottom: 24,
    lineHeight: 24,
  },
  articleGrid: {
    gap: 20,
  },
  articleCard: {
    backgroundColor: '#13131A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A3D',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 110, 247, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F0F0F8',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
    marginBottom: 12,
  },
  readTime: {
    fontSize: 13,
    color: '#555570',
  },
  arrow: {
    fontSize: 24,
    color: '#4F6EF7',
  },
  ctaSection: {
    backgroundColor: '#1C1C27',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3D',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F0F0F8',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 600,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaButton: {
    backgroundColor: '#4F6EF7',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#F0F0F8',
    fontSize: 16,
    fontWeight: '600',
  },
});
