import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../../src/components/SEO';
import { BookOpen, Target, AlertCircle, Calendar, Lightbulb } from 'lucide-react-native';

const articles = [
  {
    id: 'beginners-guide',
    title: 'Ultimate Beginner\'s Guide to LinkedIn Queens Puzzle',
    description: 'Everything you need to know to start solving Queens puzzles like a pro. Perfect for complete beginners.',
    icon: BookOpen,
    readTime: '10 min read',
    href: '/articles/beginners-guide',
  },
  {
    id: 'advanced-strategies',
    title: '10 Advanced Queens Puzzle Strategies from Experts',
    description: 'Take your Queens puzzle skills to the next level with these expert techniques and advanced solving strategies.',
    icon: Target,
    readTime: '8 min read',
    href: '/articles/advanced-strategies',
  },
  {
    id: 'common-mistakes',
    title: 'Common Queens Puzzle Mistakes and How to Fix Them',
    description: 'Avoid these frequent errors that trip up Queens puzzle solvers and learn how to correct them quickly.',
    icon: AlertCircle,
    readTime: '6 min read',
    href: '/articles/common-mistakes',
  },
  {
    id: 'daily-practice-tips',
    title: 'Master LinkedIn Queens: Daily Practice Tips',
    description: 'Build a consistent practice routine to improve your Queens puzzle solving speed and accuracy.',
    icon: Calendar,
    readTime: '5 min read',
    href: '/articles/daily-practice-tips',
  },
  {
    id: 'rules-explained',
    title: 'Queens Puzzle Rules Explained with Visual Examples',
    description: 'A comprehensive breakdown of all Queens puzzle rules with step-by-step visual examples.',
    icon: Lightbulb,
    readTime: '7 min read',
    href: '/articles/rules-explained',
  },
];

export default function ArticlesIndexPage() {
  return (
    <>
      <SEO
        title="Queens Puzzle Articles & Guides - LinkedIn Puzzle Strategy"
        description="Expert guides, strategies, and tips for mastering LinkedIn Queens puzzles. Learn from comprehensive articles covering beginner basics to advanced techniques."
        keywords={[
          'LinkedIn Queens puzzle articles',
          'Queens puzzle guide',
          'Queens puzzle strategy blog',
          'LinkedIn puzzle tips',
          'Queens puzzle tutorials',
          'puzzle game guides',
          'LinkedIn Queens help',
          'puzzle solving techniques'
        ]}
        canonicalUrl="https://puzzleedge.app/articles"
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Queens Puzzle Articles & Guides</Text>
            <Text style={styles.subtitle}>
              Expert insights, strategies, and tips to master LinkedIn Queens puzzles
            </Text>
          </View>

          <View style={styles.articleGrid}>
            {articles.map((article) => {
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

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Practice?</Text>
            <Text style={styles.ctaDescription}>
              Put your knowledge to the test with 1,600+ practice Queens puzzles
            </Text>
            <Link href="/games/queens/practice" asChild>
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Start Practicing Now</Text>
              </Pressable>
            </Link>
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
    marginBottom: 48,
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
    maxWidth: 600,
    alignSelf: 'center',
  },
  articleGrid: {
    gap: 20,
    marginBottom: 64,
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
