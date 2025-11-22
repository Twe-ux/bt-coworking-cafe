'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardPageTitle from '@/components/dashboard/DashboardPageTitle';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Badge,
  Modal,
  Table
} from 'react-bootstrap';
import IconifyIcon from '@/components/dashboard/wrappers/IconifyIcon';
import DropzoneImageUpload from '@/components/dashboard/DropzoneImageUpload';

interface DrinkCategory {
  _id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

interface Drink {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  category: { _id: string; name: string; slug: string };
  order: number;
  isActive: boolean;
}

export default function DrinksPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role?.slug;
  const canEdit = userRole === 'dev' || userRole === 'admin';

  const [categories, setCategories] = useState<DrinkCategory[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DrinkCategory | null>(null);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [drinkForm, setDrinkForm] = useState({
    name: '',
    description: '',
    image: '',
    category: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/drinks');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setCategories(data.categories);
      setDrinks(data.drinks);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  // Category handlers
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;
    setSaving(true);

    try {
      const url = editingCategory
        ? `/api/admin/drinks/categories/${editingCategory._id}`
        : '/api/admin/drinks/categories';

      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur');
      }

      setMessage({ type: 'success', text: editingCategory ? 'Catégorie mise à jour' : 'Catégorie créée' });
      setShowCategoryModal(false);
      setCategoryName('');
      setEditingCategory(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;

    try {
      const res = await fetch(`/api/admin/drinks/categories/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur');
      }

      setMessage({ type: 'success', text: 'Catégorie supprimée' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur' });
    }
  };

  // Drink handlers
  const handleSaveDrink = async () => {
    if (!drinkForm.name.trim() || !drinkForm.category) return;
    setSaving(true);

    try {
      const url = editingDrink
        ? `/api/admin/drinks/${editingDrink._id}`
        : '/api/admin/drinks';

      const res = await fetch(url, {
        method: editingDrink ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drinkForm)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur');
      }

      setMessage({ type: 'success', text: editingDrink ? 'Boisson mise à jour' : 'Boisson créée' });
      setShowDrinkModal(false);
      setDrinkForm({ name: '', description: '', image: '', category: '' });
      setEditingDrink(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDrink = async (id: string) => {
    if (!confirm('Supprimer cette boisson ?')) return;

    try {
      const res = await fetch(`/api/admin/drinks/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      setMessage({ type: 'success', text: 'Boisson supprimée' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const openEditCategory = (category: DrinkCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowCategoryModal(true);
  };

  const openEditDrink = (drink: Drink) => {
    setEditingDrink(drink);
    setDrinkForm({
      name: drink.name,
      description: drink.description || '',
      image: drink.image || '',
      category: drink.category._id
    });
    setShowDrinkModal(true);
  };

  const openNewDrink = (categoryId?: string) => {
    setEditingDrink(null);
    setDrinkForm({
      name: '',
      description: '',
      image: '',
      category: categoryId || (categories[0]?._id || '')
    });
    setShowDrinkModal(true);
  };

  if (loading) {
    return (
      <>
        <DashboardPageTitle subName="Menu" title="Gestion des boissons" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardPageTitle subName="Menu" title="Gestion des boissons" />

      {message && (
        <Alert
          variant={message.type === 'success' ? 'success' : 'danger'}
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {canEdit && (
        <Row className="mb-4">
          <Col>
            <Button
              variant="primary"
              className="me-2"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName('');
                setShowCategoryModal(true);
              }}
            >
              <IconifyIcon icon="ri:add-line" className="me-1" />
              Nouvelle catégorie
            </Button>
            <Button
              variant="success"
              onClick={() => openNewDrink()}
              disabled={categories.length === 0}
            >
              <IconifyIcon icon="ri:add-line" className="me-1" />
              Nouvelle boisson
            </Button>
          </Col>
        </Row>
      )}

      {categories.length === 0 ? (
        <Card>
          <CardBody className="text-center py-5">
            <p className="text-muted mb-0">
              Aucune catégorie créée. {canEdit && 'Commencez par créer une catégorie.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        categories.map(category => (
          <Card key={category._id} className="mb-4">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle as="h4" className="mb-0">
                {category.name}
                {!category.isActive && (
                  <Badge bg="secondary" className="ms-2">Inactif</Badge>
                )}
              </CardTitle>
              {canEdit && (
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => openNewDrink(category._id)}
                  >
                    <IconifyIcon icon="ri:add-line" />
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditCategory(category)}
                  >
                    <IconifyIcon icon="ri:edit-line" />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <IconifyIcon icon="ri:delete-bin-line" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardBody>
              {drinks.filter(d => d.category._id === category._id).length === 0 ? (
                <p className="text-muted mb-0">Aucune boisson dans cette catégorie</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Image</th>
                      <th>Nom</th>
                      <th>Description</th>
                      {canEdit && <th style={{ width: '120px' }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {drinks
                      .filter(d => d.category._id === category._id)
                      .map(drink => (
                        <tr key={drink._id}>
                          <td>
                            {drink.image ? (
                              <img
                                src={drink.image}
                                alt={drink.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <IconifyIcon icon="ri:image-line" className="text-muted" />
                              </div>
                            )}
                          </td>
                          <td className="align-middle">
                            {drink.name}
                            {!drink.isActive && (
                              <Badge bg="secondary" className="ms-2">Inactif</Badge>
                            )}
                          </td>
                          <td className="align-middle text-muted">
                            {drink.description || '-'}
                          </td>
                          {canEdit && (
                            <td className="align-middle">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-1"
                                onClick={() => openEditDrink(drink)}
                              >
                                <IconifyIcon icon="ri:edit-line" />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteDrink(drink._id)}
                              >
                                <IconifyIcon icon="ri:delete-bin-line" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        ))
      )}

      {/* Modal Catégorie */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nom de la catégorie</Form.Label>
            <Form.Control
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ex: Boissons chaudes"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveCategory} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Boisson */}
      <Modal show={showDrinkModal} onHide={() => setShowDrinkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDrink ? 'Modifier la boisson' : 'Nouvelle boisson'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Catégorie *</Form.Label>
            <Form.Select
              value={drinkForm.category}
              onChange={(e) => setDrinkForm({ ...drinkForm, category: e.target.value })}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nom *</Form.Label>
            <Form.Control
              type="text"
              value={drinkForm.name}
              onChange={(e) => setDrinkForm({ ...drinkForm, name: e.target.value })}
              placeholder="Ex: Cappuccino"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={drinkForm.description}
              onChange={(e) => setDrinkForm({ ...drinkForm, description: e.target.value })}
              placeholder="Description de la boisson..."
            />
          </Form.Group>

          <DropzoneImageUpload
            onImageUpload={(url) => setDrinkForm({ ...drinkForm, image: url })}
            currentImage={drinkForm.image}
            label="Image de la boisson"
            folder="drinks"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDrinkModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveDrink} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
