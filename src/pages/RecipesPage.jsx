import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Plus, Trash2, Search, Clock, Flame, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const COLORS = ['#2da67d','#3b82f6','#f59e0b','#8b5cf6','#ff6b6b','#10b981'];
const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Smoothie','Snack','Drink'];

function RecipeCard({ recipe, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const color = COLORS[recipe.id % COLORS.length];

  return (
    <div className="recipe-card fade-up">
      <div className="recipe-header" style={{ background: `linear-gradient(135deg, ${color}dd, ${color}99)` }}>
        <div className="recipe-tag">
          <UtensilsCrossed size={10} /> {recipe.category}
        </div>
        <div className="recipe-title">{recipe.title}</div>
        <div style={{ display:'flex', gap:16, marginTop:10, fontSize:12, opacity:0.85 }}>
          <span><Clock size={12} style={{ verticalAlign:'middle', marginRight:3 }} />{recipe.prepTime}</span>
          <span><Flame size={12} style={{ verticalAlign:'middle', marginRight:3 }} />{recipe.calories} kcal</span>
        </div>
      </div>

      <div className="recipe-body">
        {/* Tags */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
          {recipe.tags.map(t => (
            <span key={t} style={{ background:'var(--green-pale)', color:'var(--green-deep)', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99 }}>
              #{t}
            </span>
          ))}
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--slate-mid)', padding:0, marginBottom: expanded ? 12 : 0 }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Hide details' : 'View recipe'}
        </button>

        {expanded && (
          <div style={{ animation:'fadeUp 0.2s ease' }}>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--slate)', marginBottom:6 }}>Ingredients:</div>
              <ul style={{ paddingLeft:18, display:'flex', flexDirection:'column', gap:3 }}>
                {recipe.ingredients.map(ing => (
                  <li key={ing} style={{ fontSize:13, color:'var(--slate-mid)' }}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--slate)', marginBottom:6 }}>Instructions:</div>
              <div style={{ fontSize:13, color:'var(--slate-mid)', lineHeight:1.6 }}>{recipe.instructions}</div>
            </div>
          </div>
        )}

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14, paddingTop:12, borderTop:'1px solid var(--slate-pale)' }}>
          <div style={{ fontSize:11, color:'var(--slate-light)' }}>Added {recipe.date}</div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(recipe.id)}
            style={{ padding:'5px 10px' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddRecipeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title:'', category:'Breakfast', calories:'', prepTime:'',
    ingredients:'', instructions:'', tags:''
  });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const submit = () => {
    if (!form.title) return;
    onAdd({
      title: form.title,
      category: form.category,
      calories: Number(form.calories) || 0,
      prepTime: form.prepTime || '?',
      ingredients: form.ingredients.split('\n').filter(Boolean),
      instructions: form.instructions,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ position:'relative', maxWidth:560 }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-title">Add Recipe to Vault</div>
        <div className="modal-sub">Save your healthy recipes for quick access</div>

        <div className="form-group">
          <label className="form-label">Recipe Name *</label>
          <input className="form-input" placeholder="e.g. Green Detox Smoothie" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.filter(c=>c!=='All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Calories</label>
            <input className="form-input" type="number" placeholder="kcal" value={form.calories} onChange={e => set('calories', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Prep Time</label>
            <input className="form-input" placeholder="e.g. 10 min" value={form.prepTime} onChange={e => set('prepTime', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ingredients (one per line)</label>
          <textarea className="form-textarea" placeholder="Spinach&#10;Banana&#10;Ginger" value={form.ingredients} onChange={e => set('ingredients', e.target.value)} style={{ minHeight:80 }} />
        </div>

        <div className="form-group">
          <label className="form-label">Instructions</label>
          <textarea className="form-textarea" placeholder="Step by step instructions..." value={form.instructions} onChange={e => set('instructions', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input className="form-input" placeholder="healthy, vegan, quick" value={form.tags} onChange={e => set('tags', e.target.value)} />
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex:1 }} onClick={submit}><Plus size={16} /> Save Recipe</button>
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const { recipes, addRecipe, deleteRecipe } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = recipes.filter(r => {
    const matchCat = category === 'All' || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {showModal && <AddRecipeModal onClose={() => setShowModal(false)} onAdd={addRecipe} />}

      <div className="section-header fade-up">
        <div>
          <div className="section-title">Recipe Vault 🍃</div>
          <div className="section-sub">{recipes.length} recipes saved · Access anytime</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Recipe
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--slate-light)' }} />
          <input
            className="form-input"
            style={{ paddingLeft:36 }}
            placeholder="Search recipes or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-ghost'}`}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid-3">
          {filtered.map(r => <RecipeCard key={r.id} recipe={r} onDelete={deleteRecipe} />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><UtensilsCrossed size={28} /></div>
          <div className="empty-title">No recipes found</div>
          <div className="empty-text">Add your first healthy recipe to the vault!</div>
          <button className="btn btn-primary" style={{ margin:'16px auto 0', display:'flex' }} onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Recipe
          </button>
        </div>
      )}
    </div>
  );
}
