'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Button, Table, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/store/api/blogApi';
import { useNotification } from '@/hooks/useNotification';
import IconifyIcon from '@/components/dashboard/wrappers/IconifyIcon';

const CategoriesPage = () => {
  const { data, isLoading, error } = useGetCategoriesQuery({ limit: 100 });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const { success, error: showError } = useNotification();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff',
  });

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color || '#007bff',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#007bff',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#007bff' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          data: formData,
        }).unwrap();
        success('Catégorie mise à jour avec succès');
      } else {
        await createCategory(formData).unwrap();
        success('Catégorie créée avec succès');
      }
      handleCloseModal();
    } catch (err: any) {
      showError(err?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      await deleteCategory(id).unwrap();
      success('Catégorie supprimée avec succès');
    } catch (err: any) {
      showError(err?.data?.error || 'Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Chargement des catégories...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <CardTitle as="h4" className="mb-0">Gestion des Catégories</CardTitle>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <IconifyIcon icon="solar:add-circle-outline" className="me-2" />
            Nouvelle Catégorie
          </Button>
        </CardHeader>
        <CardBody>
          {error ? (
            <div className="alert alert-danger">
              Erreur lors du chargement des catégories
            </div>
          ) : !data?.categories || data.categories.length === 0 ? (
            <div className="text-center py-5">
              <IconifyIcon icon="solar:folder-outline" className="fs-48 text-muted mb-3" />
              <h5>Aucune catégorie</h5>
              <p className="text-muted mb-3">
                Commencez par créer votre première catégorie
              </p>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                Créer une catégorie
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Couleur</th>
                  <th>Articles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.categories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td>{category.description || <span className="text-muted">-</span>}</td>
                    <td>
                      <Badge
                        style={{
                          backgroundColor: category.color || '#007bff',
                          color: '#fff',
                        }}
                      >
                        {category.color || '#007bff'}
                      </Badge>
                    </td>
                    <td>{category.articleCount || 0}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <Button
                          variant="primary"
                          size="sm"
                          className="py-0 px-2"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleOpenModal(category)}
                        >
                          <IconifyIcon icon="solar:pen-outline" width={14} className="me-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="py-0 px-2"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleDelete(category._id)}
                          disabled={isDeleting}
                        >
                          <IconifyIcon icon="solar:trash-bin-outline" width={14} className="me-1" />
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Nom de la catégorie"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la catégorie"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Couleur</Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{ width: '60px', height: '40px' }}
                />
                <Form.Control
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#007bff"
                />
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCloseModal}
              className="py-1 px-3"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isCreating || isUpdating}
              className="py-1 px-3"
            >
              {isCreating || isUpdating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:check-circle-outline" width={16} className="me-1" />
                  Enregistrer
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CategoriesPage;
