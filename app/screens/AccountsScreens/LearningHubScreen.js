import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import { courses, keyTradingPoints } from '../../../constants/learningCourses';
import { useNavigation } from '@react-navigation/native';

export default function LearningHubScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showKeyPoints, setShowKeyPoints] = useState(true);
  const navigation = useNavigation();
  const categories = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'basics', label: 'Basics', icon: 'book' },
    { id: 'stocks', label: 'Stocks', icon: 'trending-up' },
    { id: 'fno', label: 'F&O', icon: 'bar-chart-2' },
    { id: 'mf', label: 'Mutual Funds', icon: 'briefcase' },
    { id: 'analysis', label: 'Analysis', icon: 'pie-chart' },
  ];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  if (selectedLesson) {
    const currentLessonIndex = selectedCourse?.modules.findIndex(m => m.title === selectedLesson.title) || 0;

    return (
      <LessonView
        lesson={selectedLesson}
        courseTitle={selectedCourse?.title}
        course={selectedCourse}
        currentLessonIndex={currentLessonIndex}
        onBack={() => setSelectedLesson(null)}
        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
      />
    );
  }

  if (selectedCourse) {
    return (
      <CourseDetailView
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Hub</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.statsBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statItem}>
            <Feather name="book" size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>60+</Text>
            <Text style={styles.statLabel}>Detailed Lessons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="clock" size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>15h+</Text>
            <Text style={styles.statLabel}>Content</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="trending-up" size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Free</Text>
          </View>
        </LinearGradient>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Complete Learnings</Text>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => setSelectedCourse(course)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderButton}
            onPress={() => setShowKeyPoints(!showKeyPoints)}
          >
            <Text style={styles.sectionTitle}>💡 Essential Trading Rules</Text>
            <Feather
              name={showKeyPoints ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#2E5CFF"
            />
          </TouchableOpacity>

          {showKeyPoints && (
            <View style={styles.keyPointsContainer}>
              {keyTradingPoints.map((point, index) => (
                <View key={index} style={styles.keyPointCard}>
                  <View style={styles.keyPointIcon}>
                    <Feather name={point.icon} size={20} color="#2E5CFF" />
                  </View>
                  <View style={styles.keyPointContent}>
                    <Text style={styles.keyPointTitle}>{point.title}</Text>
                    <Text style={styles.keyPointDescription}>{point.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.practiceCard}>
          <View style={styles.practiceIconContainer}>
            <Feather name="target" size={28} color="#2E5CFF" />
          </View>
          <View style={styles.practiceContent}>
            <Text style={styles.practiceTitle}>Ready to Practice?</Text>
            <Text style={styles.practiceSubtitle}>
              Apply your knowledge in risk-free paper trading
            </Text>
          </View>
          <Feather name="arrow-right" size={24} color="#2E5CFF" />
        </View>
      </ScrollView>
    </View>
  );
}

function CourseCard({ course, onPress }) {
  return (
    <TouchableOpacity style={styles.courseCard} activeOpacity={0.7} onPress={onPress}>
      <LinearGradient
        colors={[course.color, course.color + 'DD']}
        style={styles.courseGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: course.color + '20' }]}>
            <Text style={[styles.difficultyText, { color: course.color }]}>
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
      </View>

      <View style={styles.courseArrow}>
        <Feather name="chevron-right" size={24} color={course.color} />
      </View>
    </TouchableOpacity>
  );
}

function CourseDetailView({ course, onBack, onSelectLesson }) {
  const [expandedModule, setExpandedModule] = useState(0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[course.color, course.color + 'CC']}
        style={styles.detailHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={onBack} style={styles.detailBackButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.detailHeaderTitle}>{course.title}</Text>
        <Text style={styles.detailHeaderSubtitle}>{course.subtitle}</Text>

        <View style={styles.detailStats}>
          <View style={styles.detailStatItem}>
            <Feather name="book-open" size={18} color="#FFFFFF" />
            <Text style={styles.detailStatText}>{course.lessons} Lessons</Text>
          </View>
          <View style={styles.detailStatItem}>
            <Feather name="clock" size={18} color="#FFFFFF" />
            <Text style={styles.detailStatText}>{course.duration}</Text>
          </View>
          <View style={styles.detailStatItem}>
            <Feather name="award" size={18} color="#FFFFFF" />
            <Text style={styles.detailStatText}>{course.difficulty}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>📖 Course Modules</Text>
          <Text style={styles.detailSectionSubtitle}>
            Click any module to start learning
          </Text>

          {course.modules.map((module, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moduleCard,
                expandedModule === index && styles.moduleCardExpanded
              ]}
              onPress={() => {
                setExpandedModule(expandedModule === index ? null : index);
                if (expandedModule !== index) {
                  onSelectLesson(module);
                }
              }}
            >
              <View style={[styles.moduleNumber, { backgroundColor: course.color + '20' }]}>
                <Text style={[styles.moduleNumberText, { color: course.color }]}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <View style={styles.moduleMeta}>
                  <Feather name="clock" size={12} color="#6B7280" />
                  <Text style={styles.moduleMetaText}>{module.duration}</Text>
                </View>
              </View>

              <Feather name="play-circle" size={24} color={course.color} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.courseFeatures}>
          <Text style={styles.featuresTitle}>✨ What You'll Learn</Text>
          <View style={styles.featureItem}>
            <Feather name="check-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Complete practical knowledge</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="check-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Real-world examples and scenarios</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="check-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Step-by-step guidance</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="check-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>Trading strategies and tips</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startCourseButton, { backgroundColor: course.color }]}
          onPress={() => onSelectLesson(course.modules[0])}
        >
          <Text style={styles.startCourseButtonText}>Start Learning</Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function LessonView({ lesson, courseTitle, onBack, course, currentLessonIndex, onSelectLesson }) {
  const [bookmarked, setBookmarked] = useState(false);

  const handleNextLesson = () => {
    if (course && currentLessonIndex < course.modules.length - 1) {
      const nextLesson = course.modules[currentLessonIndex + 1];
      onSelectLesson(nextLesson);
    }
  };

  const isLastLesson = !course || currentLessonIndex >= course.modules.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.lessonHeader}>
        <View style={styles.lessonHeaderTop}>
          <TouchableOpacity onPress={onBack} style={styles.lessonBackButton}>
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => setBookmarked(!bookmarked)}
          >
            <Feather
              name={bookmarked ? "bookmark" : "bookmark"}
              size={24}
              color={bookmarked ? "#2E5CFF" : "#6B7280"}
              fill={bookmarked ? "#2E5CFF" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.lessonCourse}>{courseTitle}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>

        <View style={styles.lessonMeta}>
          <View style={styles.lessonMetaItem}>
            <Feather name="clock" size={16} color="#6B7280" />
            <Text style={styles.lessonMetaText}>{lesson.duration}</Text>
          </View>
          {course && (
            <View style={styles.lessonMetaItem}>
              <Feather name="book-open" size={16} color="#6B7280" />
              <Text style={styles.lessonMetaText}>
                Lesson {currentLessonIndex + 1} of {course.modules.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.lessonContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lessonContentContainer}
      >
        <Text style={styles.lessonBody}>{lesson.content}</Text>

        <View style={styles.lessonActions}>
          <TouchableOpacity style={styles.lessonActionButton}>
            <Feather name="message-circle" size={20} color="#2E5CFF" />
            <Text style={styles.lessonActionText}>Ask Question</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lessonActionButton}>
            <Feather name="share-2" size={20} color="#2E5CFF" />
            <Text style={styles.lessonActionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {!isLastLesson && (
          <TouchableOpacity
            style={styles.nextLessonButton}
            onPress={handleNextLesson}
          >
            <Text style={styles.nextLessonText}>Next Lesson</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {isLastLesson && (
          <TouchableOpacity
            style={[styles.nextLessonButton, { backgroundColor: '#10B981' }]}
            onPress={onBack}
          >
            <Feather name="check-circle" size={20} color="#FFFFFF" />
            <Text style={styles.nextLessonText}>Course Complete!</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
  headerRight: {
    width: 40,
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
    gap: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseGradient: {
    width: 6,
    height: '100%',
  },
  courseContent: {
    flex: 1,
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
    flexWrap: 'wrap',
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
  courseArrow: {
    paddingRight: 16,
  },
  keyPointsContainer: {
    marginTop: 8,
  },
  keyPointCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  keyPointIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  keyPointContent: {
    flex: 1,
  },
  keyPointTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  keyPointDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
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
  detailHeader: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  detailBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  detailHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailHeaderSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailStatItem: {
    alignItems: 'center',
    gap: 6,
  },
  detailStatText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detailContent: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  detailSection: {
    padding: 20,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  detailSectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moduleCardExpanded: {
    borderColor: '#2E5CFF',
    borderWidth: 2,
  },
  moduleNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleNumberText: {
    fontSize: 15,
    fontWeight: '700',
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  moduleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moduleMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  courseFeatures: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  startCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 18,
    borderRadius: 16,
    gap: 8,
  },
  startCourseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lessonHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lessonHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCourse: {
    fontSize: 13,
    color: '#2E5CFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lessonMetaText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  lessonContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  lessonContentContainer: {
    padding: 20,
  },
  lessonBody: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 32,
  },
  lessonActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  lessonActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
  },
  lessonActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E5CFF',
  },
  nextLessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E5CFF',
    padding: 18,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
  },
  nextLessonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});