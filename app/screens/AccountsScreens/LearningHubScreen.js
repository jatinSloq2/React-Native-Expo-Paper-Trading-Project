import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function LearningHubScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'basics', label: 'Basics', icon: 'book' },
    { id: 'stocks', label: 'Stocks', icon: 'trending-up' },
    { id: 'fno', label: 'F&O', icon: 'bar-chart-2' },
    { id: 'analysis', label: 'Analysis', icon: 'pie-chart' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Stock Market Fundamentals',
      subtitle: 'Learn the basics of stock trading',
      lessons: 12,
      duration: '2h 30m',
      difficulty: 'Beginner',
      category: 'basics',
      progress: 0,
      color: '#10B981'
    },
    {
      id: 2,
      title: 'Technical Analysis Masterclass',
      subtitle: 'Master charts and indicators',
      lessons: 18,
      duration: '4h 15m',
      difficulty: 'Intermediate',
      category: 'analysis',
      progress: 35,
      color: '#F59E0B'
    },
    {
      id: 3,
      title: 'Options Trading Strategies',
      subtitle: 'Advanced F&O trading techniques',
      lessons: 15,
      duration: '3h 45m',
      difficulty: 'Advanced',
      category: 'fno',
      progress: 0,
      color: '#DC2626'
    },
    {
      id: 4,
      title: 'Fundamental Analysis',
      subtitle: 'Evaluate companies like a pro',
      lessons: 10,
      duration: '2h 0m',
      difficulty: 'Intermediate',
      category: 'stocks',
      progress: 60,
      color: '#8B5CF6'
    },
    {
      id: 5,
      title: 'Risk Management Essentials',
      subtitle: 'Protect your capital effectively',
      lessons: 8,
      duration: '1h 45m',
      difficulty: 'Beginner',
      category: 'basics',
      progress: 100,
      color: '#06B6D4'
    },
  ];

  const articles = [
    { title: '10 Trading Mistakes to Avoid', readTime: '5 min' },
    { title: 'Understanding Market Volatility', readTime: '7 min' },
    { title: 'Building a Diversified Portfolio', readTime: '6 min' },
  ];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning Hub</Text>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerSubtitle}>
          Master trading skills at your own pace
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Banner */}
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.statsBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Courses In Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8h</Text>
            <Text style={styles.statLabel}>Learning Time</Text>
          </View>
        </LinearGradient>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Feather
                name={category.icon}
                size={16}
                color={selectedCategory === category.id ? '#FFFFFF' : '#6B7280'}
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </View>

        {/* Quick Articles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Reads</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </View>

        {/* Practice Section */}
        <TouchableOpacity style={styles.practiceCard}>
          <View style={styles.practiceIconContainer}>
            <Feather name="target" size={28} color="#2E5CFF" />
          </View>
          <View style={styles.practiceContent}>
            <Text style={styles.practiceTitle}>Practice Trading</Text>
            <Text style={styles.practiceSubtitle}>
              Apply what you've learned in a risk-free environment
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function CourseCard({ course }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity style={styles.courseCard} activeOpacity={0.7}>
      <View style={[styles.courseColorBar, { backgroundColor: course.color }]} />

      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: `${getDifficultyColor(course.difficulty)}15` }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: getDifficultyColor(course.difficulty) }
            ]}>
              {course.difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.courseSubtitle}>{course.subtitle}</Text>

        <View style={styles.courseInfo}>
          <View style={styles.courseInfoItem}>
            <Feather name="book-open" size={14} color="#6B7280" />
            <Text style={styles.courseInfoText}>{course.lessons} lessons</Text>
          </View>
          <View style={styles.courseInfoItem}>
            <Feather name="clock" size={14} color="#6B7280" />
            <Text style={styles.courseInfoText}>{course.duration}</Text>
          </View>
        </View>

        {course.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{course.progress}% complete</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function ArticleCard({ article }) {
  return (
    <TouchableOpacity style={styles.articleCard} activeOpacity={0.7}>
      <View style={styles.articleIcon}>
        <Feather name="file-text" size={20} color="#2E5CFF" />
      </View>
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <View style={styles.articleMeta}>
          <Feather name="clock" size={12} color="#9CA3AF" />
          <Text style={styles.articleReadTime}>{article.readTime} read</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  statsBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoriesContainer: {
    marginTop: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#2E5CFF',
    borderColor: '#2E5CFF',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E5CFF',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseColorBar: {
    height: 4,
  },
  courseContent: {
    padding: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  courseInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  courseInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseInfoText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  articleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleReadTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#2E5CFF',
  },
  practiceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  practiceContent: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  practiceSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});