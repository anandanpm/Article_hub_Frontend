import React, { useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useFormik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import './ArticleCreation.scss';
import type { ArticleFormValues, ReduxData, SubmitStatus } from '../entities/interface';
import userApi from '../api/userApi';
import { useSelector } from 'react-redux';
import uploadImageToCloudinary from '../config/Cloudinary';




const ArticleCreationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: '', message: '' });
  const userId = useSelector((state: ReduxData) => state.user.user.id);
  const categories: string[] = [
    'technology',
    'science',
    'health',
    'business',
    'entertainment',
    'sports',
    'politics',
    'travel',
    'education',
    'movies',
    'other'
  ];

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must be less than 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(20, 'Description must be at least 20 characters'),
    category: Yup.string()
      .required('Category is required')
      .oneOf(categories, 'Please select a valid category'),
    tags: Yup.string()
      .required('At least one tag is required')
      .test('tags', 'Enter tags separated by commas', value => 
        value ? value.split(',').filter(tag => tag.trim()).length > 0 : false
      ),
    image: Yup.mixed()
      .required('Image is required')
      .test('fileSize', 'Image size is too large (max 5MB)', (value: any) => 
        !value || (value && value.size <= 5 * 1024 * 1024)
      )
      .test('fileType', 'Unsupported file format', (value: any) =>
        !value || (value && ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type))
      )
  });

  // Initialize formik
  const formik = useFormik<ArticleFormValues>({
    initialValues: {
      title: '',
      description: '',
      category: '',
      tags: '',
      image: null
    },
    validationSchema,
    onSubmit: async (values: ArticleFormValues, { resetForm }: FormikHelpers<ArticleFormValues>) => {
      try {
        setIsLoading(true);
        setSubmitStatus({ type: '', message: '' });
        
        if (!values.image) {
          throw new Error('Image is required');
        }
        
        // Upload image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(values.image);
        
        // Prepare article data with the Cloudinary image URL
        const articleData = {
          title: values.title,
          description: values.description,
          category: values.category,
          tags: values.tags.split(',').map(tag => tag.trim()),
          imageUrl,
          userId
        };
        
        // Send article data to backend API
       await userApi.createArticle(articleData);
        
        setSubmitStatus({
          type: 'success',
          message: 'Article created successfully!'
        });
        
        // Reset form
        resetForm();
        setImagePreview(null);
        
      } catch (error: any) {
        console.error('Error creating article:', error);
        setSubmitStatus({
          type: 'error',
          message: error.response?.data?.message || 'Failed to create article. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  });

 
  // Handle image change
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      className="article-creation-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="page-title"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        Create New Article
      </motion.h1>

      {submitStatus.message && (
        <motion.div 
          className={`status-message ${submitStatus.type}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {submitStatus.message}
        </motion.div>
      )}

      <motion.form 
        className="article-form"
        onSubmit={formik.handleSubmit}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter article title"
            className={formik.touched.title && formik.errors.title ? 'error' : ''}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="error-message">{formik.errors.title}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter article description"
            rows={6}
            className={formik.touched.description && formik.errors.description ? 'error' : ''}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error-message">{formik.errors.description}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.category && formik.errors.category ? 'error' : ''}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="error-message">{formik.errors.category}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formik.values.tags}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter tags separated by commas (e.g., react, javascript, web)"
            className={formik.touched.tags && formik.errors.tags ? 'error' : ''}
          />
          {formik.touched.tags && formik.errors.tags && (
            <div className="error-message">{formik.errors.tags}</div>
          )}
        </div>

        <div className="form-group image-upload-container">
          <label htmlFor="image">Article Image</label>
          <div className="image-input-container">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleImageChange}
              onBlur={() => formik.setFieldTouched('image', true)}
              className="image-input"
            />
            <label htmlFor="image" className="image-upload-button">
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
          {formik.touched.image && formik.errors.image && (
            <div className="error-message">{formik.errors.image}</div>
          )}
          
          {imagePreview && (
            <motion.div 
              className="image-preview-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={imagePreview} alt="Preview" className="image-preview" />
            </motion.div>
          )}
        </div>

        <motion.button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Create Article'
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default ArticleCreationPage;