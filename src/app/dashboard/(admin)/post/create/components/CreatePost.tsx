"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextFormInput from "@/components/dashboard/from/TextFormInput";
import TextAreaFormInput from "@/components/dashboard/from/TextAreaFormInput";
import ImageUpload from "@/components/dashboard/ImageUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Form,
  Spinner,
} from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useCreateArticleMutation } from "@/store/api/blogApi";
import { useNotification } from "@/hooks/useNotification";

const CreatePost = () => {
  const router = useRouter();
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const { success, error: showError } = useNotification();
  const [selectedStatus, setSelectedStatus] = useState<string>("draft");

  const articleSchema = yup.object({
    title: yup.string().required("Le titre est obligatoire").min(5, "Le titre doit contenir au moins 5 caractères").defined(),
    excerpt: yup.string().max(300, "L'extrait ne peut pas dépasser 300 caractères").defined().default(""),
    content: yup.string().required("Le contenu est obligatoire").min(50, "Le contenu doit contenir au moins 50 caractères").defined(),
    featuredImage: yup.string().url("L'URL de l'image doit être valide").defined().default(""),
    categoryId: yup.string().defined().default(""),
    tagIds: yup.array().of(yup.string()).defined().default([]),
    scheduledFor: yup.date().nullable().default(null),
    seoMetaTitle: yup.string().max(60, "Le meta titre ne peut pas dépasser 60 caractères").defined().default(""),
    seoMetaDescription: yup.string().max(160, "La meta description ne peut pas dépasser 160 caractères").defined().default(""),
    seoMetaKeywords: yup.array().of(yup.string()).defined().default([]),
    seoOgImage: yup.string().url("L'URL de l'image OG doit être valide").defined().default(""),
  });

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categoryId: "",
      tagIds: [],
      scheduledFor: null,
      seoMetaTitle: "",
      seoMetaDescription: "",
      seoMetaKeywords: [],
      seoOgImage: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const articleData: any = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || undefined,
        featuredImage: data.featuredImage || undefined,
        categoryId: data.categoryId || undefined,
        tagIds: data.tagIds?.filter(Boolean) || [],
        status: selectedStatus,
        scheduledFor: data.scheduledFor || undefined,
        seo: {
          metaTitle: data.seoMetaTitle || undefined,
          metaDescription: data.seoMetaDescription || undefined,
          metaKeywords: data.seoMetaKeywords?.filter(Boolean) || [],
          ogImage: data.seoOgImage || undefined,
        },
      };

      const result = await createArticle(articleData).unwrap();
      success("Article créé avec succès");

      // Redirect to the edit page or post list
      router.push(`/dashboard/post/edit/${result._id}`);
    } catch (err: any) {
      console.error("Error creating article:", err);
      showError(err?.data?.error || "Erreur lors de la création de l'article");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle as={"h4"}>Informations de l'article</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={12}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="title"
                  placeholder="Titre de l'article"
                  label="Titre *"
                />
                {errors.title && (
                  <small className="text-danger">{errors.title.message}</small>
                )}
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput
                  control={control}
                  name="excerpt"
                  label="Extrait (résumé court)"
                  rows={2}
                  placeholder="Un court résumé de l'article..."
                />
                {errors.excerpt && (
                  <small className="text-danger">{errors.excerpt.message}</small>
                )}
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput
                  control={control}
                  name="content"
                  label="Contenu *"
                  rows={12}
                  placeholder="Écrivez votre article ici..."
                />
                {errors.content && (
                  <small className="text-danger">{errors.content.message}</small>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    onImageUpload={field.onChange}
                    currentImage={field.value}
                    label="Image à la une"
                    folder="blog"
                  />
                )}
              />
              {errors.featuredImage && (
                <small className="text-danger">{errors.featuredImage.message}</small>
              )}
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Statut *
                </label>
                <Form.Select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                  <option value="scheduled">Programmé</option>
                </Form.Select>
              </div>
            </Col>

            {selectedStatus === "scheduled" && (
              <Col lg={6}>
                <div className="mb-3">
                  <Controller
                    name="scheduledFor"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor="scheduledFor" className="form-label">
                          Date de publication programmée
                        </label>
                        <input
                          {...field}
                          type="datetime-local"
                          id="scheduledFor"
                          className="form-control"
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        />
                      </>
                    )}
                  />
                </div>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as={"h4"}>SEO (Référencement)</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="seoMetaTitle"
                  placeholder="Titre pour les moteurs de recherche"
                  label="Meta Titre"
                />
                {errors.seoMetaTitle && (
                  <small className="text-danger">{errors.seoMetaTitle.message}</small>
                )}
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="seoOgImage"
                  placeholder="https://example.com/og-image.jpg"
                  label="Image Open Graph (réseaux sociaux)"
                />
                {errors.seoOgImage && (
                  <small className="text-danger">{errors.seoOgImage.message}</small>
                )}
              </div>
            </Col>

            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput
                  control={control}
                  name="seoMetaDescription"
                  label="Meta Description"
                  rows={2}
                  placeholder="Description pour les moteurs de recherche..."
                />
                {errors.seoMetaDescription && (
                  <small className="text-danger">{errors.seoMetaDescription.message}</small>
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button
              variant="outline-primary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Création...
                </>
              ) : (
                "Créer l'article"
              )}
            </Button>
          </Col>
          <Col lg={2}>
            <Button
              variant="danger"
              className="w-100"
              onClick={() => router.push("/dashboard/post")}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default CreatePost;
